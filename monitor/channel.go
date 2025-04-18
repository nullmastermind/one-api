package monitor

import (
	"fmt"

	"github.com/songquanpeng/one-api/common/config"
	"github.com/songquanpeng/one-api/common/logger"
	"github.com/songquanpeng/one-api/common/message"
	"github.com/songquanpeng/one-api/model"
)

func notifyRootUser(subject string, content string) {
	if config.MessagePusherAddress != "" {
		err := message.SendMessage(subject, content, content)
		if err != nil {
			logger.SysError(fmt.Sprintf("failed to send message: %s", err.Error()))
		} else {
			return
		}
	}
	if config.RootUserEmail == "" {
		config.RootUserEmail = model.GetRootUserEmail()
	}
	err := message.SendEmail(subject, config.RootUserEmail, content)
	if err != nil {
		logger.SysError(fmt.Sprintf("failed to send email: %s", err.Error()))
	}
}

// DisableChannel disable & notify
func DisableChannel(channelId int, channelName string, reason string) {
	model.UpdateChannelStatusById(channelId, model.ChannelStatusAutoDisabled)
	logger.SysLog(fmt.Sprintf("channel #%d has been disabled: %s", channelId, reason))
	subject := fmt.Sprintf("Channel status change alert!")
	content := message.EmailTemplate(
		subject,
		fmt.Sprintf(`
			<p>Hello!</p>
			The channel "<strong>%s</strong>" (#%d) has been disabled.
			Reason for ban:
			<p style="background-color: #f8f8f8; padding: 10px; border-radius: 4px;">%s</p>
		`, channelName, channelId, reason),
	)
	notifyRootUser(subject, content)
}

func MetricDisableChannel(channelId int, successRate float64) {
	model.UpdateChannelStatusById(channelId, model.ChannelStatusAutoDisabled)
	logger.SysLog(fmt.Sprintf("channel #%d has been disabled due to low success rate: %.2f", channelId, successRate*100))
	subject := fmt.Sprintf("渠道状态变更提醒")
	content := message.EmailTemplate(
		subject,
		fmt.Sprintf(`
			Hi there!
			Channel #%d has been automatically disabled by the system.
			Reason for ban:
			<p style="background-color: #f8f8f8; padding: 10px; border-radius: 4px;">This channel's success rate in the last %d calls: <strong>%.2f%%</strong>, below system threshold <strong>%.2f%%</strong>.</p>
		`, channelId, config.MetricQueueSize, successRate*100, config.MetricSuccessRateThreshold*100),
	)
	notifyRootUser(subject, content)
}

// EnableChannel enable & notify
func EnableChannel(channelId int, channelName string) {
	model.UpdateChannelStatusById(channelId, model.ChannelStatusEnabled)
	logger.SysLog(fmt.Sprintf("channel #%d has been enabled", channelId))
	subject := fmt.Sprintf("Channel status change alert!")
	content := message.EmailTemplate(
		subject,
		fmt.Sprintf(`
			<p>Hello!</p>
			<p>Channel "<strong>%s</strong>" (#%d) has been re-enabled.</p>
			<p>You can continue using the channel now.</p>
		`, channelName, channelId),
	)
	notifyRootUser(subject, content)
}
