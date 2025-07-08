package openai

import (
	"encoding/json"
	"time"

	"github.com/songquanpeng/one-api/relay/model"
)

// FlexibleTimestamp handles both int64 Unix timestamps and ISO 8601 string timestamps
type FlexibleTimestamp int64

// NewFlexibleTimestamp creates a FlexibleTimestamp from an int64
func NewFlexibleTimestamp(timestamp int64) FlexibleTimestamp {
	return FlexibleTimestamp(timestamp)
}

// FromInt64 creates a FlexibleTimestamp from an int64 (alias for NewFlexibleTimestamp)
func FromInt64(timestamp int64) FlexibleTimestamp {
	return FlexibleTimestamp(timestamp)
}

// UnmarshalJSON implements custom JSON unmarshaling for FlexibleTimestamp
func (ft *FlexibleTimestamp) UnmarshalJSON(data []byte) error {
	// Try to unmarshal as int64 first (Unix timestamp)
	var timestamp int64
	if err := json.Unmarshal(data, &timestamp); err == nil {
		*ft = FlexibleTimestamp(timestamp)
		return nil
	}

	// If that fails, try to unmarshal as string (ISO 8601)
	var timeStr string
	if err := json.Unmarshal(data, &timeStr); err != nil {
		return err
	}

	// Parse the ISO 8601 string
	parsedTime, err := time.Parse(time.RFC3339, timeStr)
	if err != nil {
		// Try alternative formats if RFC3339 fails
		if parsedTime, err = time.Parse("2006-01-02T15:04:05Z07:00", timeStr); err != nil {
			return err
		}
	}

	*ft = FlexibleTimestamp(parsedTime.Unix())
	return nil
}

// MarshalJSON implements custom JSON marshaling for FlexibleTimestamp
func (ft FlexibleTimestamp) MarshalJSON() ([]byte, error) {
	return json.Marshal(int64(ft))
}

// Int64 returns the timestamp as int64
func (ft FlexibleTimestamp) Int64() int64 {
	return int64(ft)
}

type TextContent struct {
	Type string `json:"type,omitempty"`
	Text string `json:"text,omitempty"`
}

type ImageContent struct {
	Type     string          `json:"type,omitempty"`
	ImageURL *model.ImageURL `json:"image_url,omitempty"`
}

type ChatRequest struct {
	Model     string          `json:"model"`
	Messages  []model.Message `json:"messages"`
	MaxTokens int             `json:"max_tokens"`
}

type TextRequest struct {
	Model     string          `json:"model"`
	Messages  []model.Message `json:"messages"`
	Prompt    string          `json:"prompt"`
	MaxTokens int             `json:"max_tokens"`
	//Stream   bool      `json:"stream"`
}

// ImageRequest docs: https://platform.openai.com/docs/api-reference/images/create
type ImageRequest struct {
	Model          string `json:"model"`
	Prompt         string `json:"prompt" binding:"required"`
	N              int    `json:"n,omitempty"`
	Size           string `json:"size,omitempty"`
	Quality        string `json:"quality,omitempty"`
	ResponseFormat string `json:"response_format,omitempty"`
	Style          string `json:"style,omitempty"`
	User           string `json:"user,omitempty"`
}

type WhisperJSONResponse struct {
	Text string `json:"text,omitempty"`
}

type WhisperVerboseJSONResponse struct {
	Task     string    `json:"task,omitempty"`
	Language string    `json:"language,omitempty"`
	Duration float64   `json:"duration,omitempty"`
	Text     string    `json:"text,omitempty"`
	Segments []Segment `json:"segments,omitempty"`
}

type Segment struct {
	Id               int     `json:"id"`
	Seek             int     `json:"seek"`
	Start            float64 `json:"start"`
	End              float64 `json:"end"`
	Text             string  `json:"text"`
	Tokens           []int   `json:"tokens"`
	Temperature      float64 `json:"temperature"`
	AvgLogprob       float64 `json:"avg_logprob"`
	CompressionRatio float64 `json:"compression_ratio"`
	NoSpeechProb     float64 `json:"no_speech_prob"`
}

type TextToSpeechRequest struct {
	Model          string  `json:"model" binding:"required"`
	Input          string  `json:"input" binding:"required"`
	Voice          string  `json:"voice" binding:"required"`
	Speed          float64 `json:"speed"`
	ResponseFormat string  `json:"response_format"`
}

type UsageOrResponseText struct {
	*model.Usage
	ResponseText string
}

type SlimTextResponse struct {
	Choices     []TextResponseChoice `json:"choices"`
	model.Usage `json:"usage"`
	Error       model.Error `json:"error"`
}

type TextResponseChoice struct {
	Index         int `json:"index"`
	model.Message `json:"message"`
	FinishReason  string `json:"finish_reason"`
}

type TextResponse struct {
	Id          string               `json:"id"`
	Model       string               `json:"model,omitempty"`
	Object      string               `json:"object"`
	Created     int64                `json:"created"`
	Choices     []TextResponseChoice `json:"choices"`
	model.Usage `json:"usage"`
}

// TextResponseFlexible is like TextResponse but with flexible timestamp parsing
type TextResponseFlexible struct {
	Id          string               `json:"id"`
	Model       string               `json:"model,omitempty"`
	Object      string               `json:"object"`
	Created     FlexibleTimestamp    `json:"created"`
	Choices     []TextResponseChoice `json:"choices"`
	model.Usage `json:"usage"`
}

// ToTextResponse converts TextResponseFlexible to TextResponse
func (trf *TextResponseFlexible) ToTextResponse() *TextResponse {
	return &TextResponse{
		Id:      trf.Id,
		Model:   trf.Model,
		Object:  trf.Object,
		Created: trf.Created.Int64(),
		Choices: trf.Choices,
		Usage:   trf.Usage,
	}
}

type EmbeddingResponseItem struct {
	Object    string    `json:"object"`
	Index     int       `json:"index"`
	Embedding []float64 `json:"embedding"`
}

type EmbeddingResponse struct {
	Object      string                  `json:"object"`
	Data        []EmbeddingResponseItem `json:"data"`
	Model       string                  `json:"model"`
	model.Usage `json:"usage"`
}

type ImageData struct {
	Url           string `json:"url,omitempty"`
	B64Json       string `json:"b64_json,omitempty"`
	RevisedPrompt string `json:"revised_prompt,omitempty"`
}

type ImageResponse struct {
	Created int64       `json:"created"`
	Data    []ImageData `json:"data"`
	//model.Usage `json:"usage"`
}

type ChatCompletionsStreamResponseChoice struct {
	Index        int           `json:"index"`
	Delta        model.Message `json:"delta"`
	FinishReason *string       `json:"finish_reason,omitempty"`
}

type ChatCompletionsStreamResponse struct {
	Id      string                                `json:"id"`
	Object  string                                `json:"object"`
	Created int64                                 `json:"created"`
	Model   string                                `json:"model"`
	Choices []ChatCompletionsStreamResponseChoice `json:"choices"`
	Usage   *model.Usage                          `json:"usage,omitempty"`
}

type CompletionsStreamResponse struct {
	Choices []struct {
		Text         string `json:"text"`
		FinishReason string `json:"finish_reason"`
	} `json:"choices"`
}
