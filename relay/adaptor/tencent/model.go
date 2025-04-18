package tencent

type Message struct {
	Role    string `json:"Role"`
	Content string `json:"Content"`
}

type ChatRequest struct {
	// Model names, options include hunyuan-lite, hunyuan-standard, hunyuan-standard-256K, hunyuan-pro.
	// Check out the [Product Overview](https://cloud.tencent.com/document/product/1729/104753) for details on each model!
	//
	// Note:
	// Different models have different billing methods. Please refer to the [Purchase Guide](https://cloud.tencent.com/document/product/1729/97731) to call them on demand.
	Model *string `json:"Model"`
	// Chat context info.
	// Note:
	// 1. Max length of 40, ordered from oldest to newest in the array by conversation time.
	// 2. Message.Role possible values: system, user, assistant.
	// FYI, the system role is optional, but if it's there, it's gotta be at the very beginning of the list. User and assistant roles should alternate (like a Q&A sesh), starting and ending with a user question. And hey, content can't be empty! Role order example: [system (optional) user assistant user assistant user ...].
	// 3. The total length of Content in Messages cannot exceed the model input length limit (refer to the [Product Overview](https://cloud.tencent.com/document/product/1729/104753) document). If it does, the earliest content will be truncated, and only the content at the end will be retained.
	Messages []*Message `json:"Messages"`
	// Streaming call switch.
	// Note:
	// 1. Defaults to non-streaming call (false) if no value is passed.
	// 2. Streaming calls incrementally return results via the SSE protocol (the return value is taken from Choices[n].Delta, and incremental data needs to be concatenated to get the complete result).
	// 3. For non-streaming calls:
	// The invocation method is the same as a normal HTTP request.
	// The interface response time is a bit long. Set it to "true" for lower latency!
	// Only return the final result once (the return value takes the value in Choices[n].Message).
	//
	// Note:
	// When calling via SDK, streaming and non-streaming calls need **different ways** to get the return value. Refer to the comments or examples in the SDK (in the examples/hunyuan/v20230901/ directory of each language SDK code repository).
	Stream *bool `json:"Stream"`
	// Note:
	// 1. This affects the diversity of the output text. The larger the value, the more diverse the generated text.
	// 2. The value range is [0.0, 1.0]. If no value is passed, the recommended value of each model is used.
	// 3. It is not recommended to use this unless necessary, as unreasonable values will affect the results.
	TopP *float64 `json:"TopP,omitempty"`
	// Note:
	// 1. Higher values make the output more random, while lower values make it more focused and deterministic.
	// 2. The value range is [0.0, 2.0]. The recommended value of each model will be used if no value is passed.
	// 3. It is not recommended to use this unless necessary, as unreasonable values will affect the results.
	Temperature *float64 `json:"Temperature,omitempty"`
}

type Error struct {
	Code    string `json:"Code"`
	Message string `json:"Message"`
}

type Usage struct {
	PromptTokens     int `json:"PromptTokens"`
	CompletionTokens int `json:"CompletionTokens"`
	TotalTokens      int `json:"TotalTokens"`
}

type ResponseChoices struct {
	FinishReason string  `json:"FinishReason,omitempty"` // Streaming end flag, if it's "stop", it means it's the last packet.
	Messages     Message `json:"Message,omitempty"`      // Content: In sync mode, you get the content back. In streaming mode, it's null. Max support is 1024 tokens.
	Delta        Message `json:"Delta,omitempty"`        // Content: Stream mode returns content, sync mode returns null. Content output supports up to 1024 tokens.
}

type ChatResponse struct {
	Choices []ResponseChoices `json:"Choices,omitempty"`   // Results
	Created int64             `json:"Created,omitempty"`   // Unix timestamp string
	Id      string            `json:"Id,omitempty"`        // Conversation ID
	Usage   Usage             `json:"Usage,omitempty"`     // Token quantity
	Error   Error             `json:"Error,omitempty"`     // Error message alert: This field may return null, meaning no valid value can be obtained.
	Note    string            `json:"Note,omitempty"`      // Comments
	ReqID   string            `json:"RequestId,omitempty"` // Unique request ID, returned with every request. Used for feedback interface input parameters.
}

type ChatResponseP struct {
	Response ChatResponse `json:"Response,omitempty"`
}

type EmbeddingRequest struct {
	InputList []string `json:"InputList"`
}

type EmbeddingData struct {
	Embedding []float64 `json:"Embedding"`
	Index     int       `json:"Index"`
	Object    string    `json:"Object"`
}

type EmbeddingUsage struct {
	PromptTokens int `json:"PromptTokens"`
	TotalTokens  int `json:"TotalTokens"`
}

type EmbeddingResponse struct {
	Data           []EmbeddingData `json:"Data"`
	EmbeddingUsage EmbeddingUsage  `json:"Usage,omitempty"`
	RequestId      string          `json:"RequestId,omitempty"`
	Error          Error           `json:"Error,omitempty"`
}

type EmbeddingResponseP struct {
	Response EmbeddingResponse `json:"Response,omitempty"`
}
