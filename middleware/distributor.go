package middleware

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/songquanpeng/one-api/common/ctxkey"
	"github.com/songquanpeng/one-api/common/logger"
	"github.com/songquanpeng/one-api/model"
	"github.com/songquanpeng/one-api/relay/channeltype"
)

type ModelRequest struct {
	Model string `json:"model" form:"model"`
}

func Distribute() func(c *gin.Context) {
	return func(c *gin.Context) {
		ctx := c.Request.Context()
		userId := c.GetInt(ctxkey.Id)
		userGroup, _ := model.CacheGetUserGroup(userId)
		c.Set(ctxkey.Group, userGroup)
		var requestModel string
		var channel *model.Channel
		channelId, ok := c.Get(ctxkey.SpecificChannelId)
		if ok {
			id, err := strconv.Atoi(channelId.(string))
			if err != nil {
				abortWithMessage(c, http.StatusBadRequest, "Invalid channel ID")
				return
			}
			channel, err = model.GetChannelById(id, true)
			if err != nil {
				abortWithMessage(c, http.StatusBadRequest, "Invalid channel ID")
				return
			}
			if channel.Status != model.ChannelStatusEnabled {
				abortWithMessage(c, http.StatusForbidden, "This channel has been disabled.")
				return
			}
		} else {
			requestModel = c.GetString(ctxkey.RequestModel)
			var err error
			channel, err = model.CacheGetRandomSatisfiedChannel(userGroup, requestModel, false)
			if err != nil {
				message := fmt.Sprintf("No available channels for model %s in the current group %s.", userGroup, requestModel)
				if channel != nil {
					logger.SysError(fmt.Sprintf("Channel does not exist: %d", channel.Id))
					message = "Database consistency is compromised, please contact the administrator."
				}
				abortWithMessage(c, http.StatusServiceUnavailable, message)
				return
			}
		}
		logger.Debugf(ctx, "user id %d, user group: %s, request model: %s, using channel #%d", userId, userGroup, requestModel, channel.Id)
		SetupContextForSelectedChannel(c, channel, requestModel)
		c.Next()
	}
}

func SetupContextForSelectedChannel(c *gin.Context, channel *model.Channel, modelName string) {
	c.Set(ctxkey.Channel, channel.Type)
	c.Set(ctxkey.ChannelId, channel.Id)
	c.Set(ctxkey.ChannelName, channel.Name)
	if channel.SystemPrompt != nil && *channel.SystemPrompt != "" {
		c.Set(ctxkey.SystemPrompt, *channel.SystemPrompt)
	}
	c.Set(ctxkey.ModelMapping, channel.GetModelMapping())
	c.Set(ctxkey.OriginalModel, modelName) // for retry
	c.Request.Header.Set("Authorization", fmt.Sprintf("Bearer %s", channel.Key))
	c.Set(ctxkey.BaseURL, channel.GetBaseURL())
	cfg, _ := channel.LoadConfig()
	// this is for backward compatibility
	if channel.Other != nil {
		switch channel.Type {
		case channeltype.Azure:
			if cfg.APIVersion == "" {
				cfg.APIVersion = *channel.Other
			}
		case channeltype.Xunfei:
			if cfg.APIVersion == "" {
				cfg.APIVersion = *channel.Other
			}
		case channeltype.Gemini:
			if cfg.APIVersion == "" {
				cfg.APIVersion = *channel.Other
			}
		case channeltype.AIProxyLibrary:
			if cfg.LibraryID == "" {
				cfg.LibraryID = *channel.Other
			}
		case channeltype.Ali:
			if cfg.Plugin == "" {
				cfg.Plugin = *channel.Other
			}
		}
	}
	c.Set(ctxkey.Config, cfg)
}
