export const CHANNEL_OPTIONS = [
  { key: 1, text: 'OpenAI', value: 1, color: 'green' },
  {
    key: 50,
    text: 'OpenAI compatible',
    value: 50,
    color: 'olive',
    description: 'OpenAI-compatible channel, supports setting Base URL',
  },
  { key: 14, text: 'Anthropic', value: 14, color: 'black' },
  { key: 33, text: 'AWS', value: 33, color: 'black' },
  { key: 3, text: 'Azure', value: 3, color: 'olive' },
  { key: 11, text: 'PaLM2', value: 11, color: 'orange' },
  { key: 24, text: 'Gemini', value: 24, color: 'orange' },
  {
    key: 51,
    text: 'Gemini (OpenAI)',
    value: 51,
    color: 'orange',
    description: 'Gemini OpenAI compatible format',
  },
  { key: 28, text: 'Mistral AI', value: 28, color: 'orange' },
  { key: 41, text: 'Novita', value: 41, color: 'purple' },
  {
    key: 40,
    text: 'ByteDance Volcano Engine',
    value: 40,
    color: 'blue',
    description: 'Formerly ByteDance Doubao',
  },
  {
    key: 15,
    text: 'Baidu Wenxin Qianfan',
    value: 15,
    color: 'blue',
    tip: 'Head over <a href="https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application/v1" target="_blank">here</a> to grab your AK (API Key) and SK (Secret Key)! Just a heads up, for the V2 version interface, make sure to use the <strong>Baidu Wenxin Qianfan V2</strong> channel type.',
  },
  {
    key: 47,
    text: 'Baidu Wenxin Qianfan V2',
    value: 47,
    color: 'blue',
    tip: 'Get your API Key <a href="https://console.bce.baidu.com/iam/#/iam/apikey/list" target="_blank">here</a>! Just a heads up, this channel only supports models related to <a target="_blank" href="https://cloud.baidu.com/doc/WENXINWORKSHOP/s/em4tsqo3v">Inference Service V2</a>.',
  },
  {
    key: 17,
    text: 'Alibaba Tongyi Qianwen',
    value: 17,
    color: 'orange',
    tip: 'To use Alibaba Cloud Bailian, please use the **Alibaba Cloud Bailian** channel.',
  },
  { key: 49, text: 'Aliyun Bailian', value: 49, color: 'orange' },
  {
    key: 18,
    text: 'iFlytek Spark Cognitive',
    value: 18,
    color: 'blue',
    tip: 'This channel is based on the iFlytek WebSocket version API. If you need the HTTP version, please use the iFlytek Spark Cognition V2 channel.',
  },
  {
    key: 48,
    text: 'iFlytek Spark Cognitive V2',
    value: 48,
    color: 'blue',
    tip: 'For the HTTP version of the iFlytek interface, get your HTTP service interface authentication key <a href="https://console.xfyun.cn/services/cbm" target="_blank">here</a>!',
  },
  { key: 16, text: 'Zhipu ChatGLM', value: 16, color: 'violet' },
  { key: 19, text: '360 Smart Brain', value: 19, color: 'blue' },
  { key: 25, text: 'Moonshot AI', value: 25, color: 'black' },
  { key: 23, text: 'Tencent Hunyuan', value: 23, color: 'teal' },
  { key: 26, text: 'Baichuan Large Model', value: 26, color: 'orange' },
  { key: 27, text: 'MiniMax', value: 27, color: 'red' },
  { key: 29, text: 'Groq', value: 29, color: 'orange' },
  { key: 30, text: 'Ollama', value: 30, color: 'black' },
  { key: 31, text: '01.AI', value: 31, color: 'green' },
  { key: 32, text: 'Stepping into the Stars', value: 32, color: 'blue' },
  { key: 34, text: 'Coze', value: 34, color: 'blue' },
  { key: 35, text: 'Cohere', value: 35, color: 'blue' },
  { key: 36, text: 'DeepSeek', value: 36, color: 'black' },
  { key: 37, text: 'Cloudflare', value: 37, color: 'orange' },
  { key: 38, text: 'DeepL', value: 38, color: 'black' },
  { key: 39, text: 'together.ai', value: 39, color: 'blue' },
  { key: 42, text: 'VertexAI', value: 42, color: 'blue' },
  { key: 43, text: 'Proxy', value: 43, color: 'blue' },
  { key: 44, text: 'SiliconFlow', value: 44, color: 'blue' },
  { key: 45, text: 'xAI', value: 45, color: 'blue' },
  { key: 46, text: 'Replicate', value: 46, color: 'blue' },
  {
    key: 8,
    text: 'Custom channels',
    value: 8,
    color: 'pink',
    tip: 'This is not recommended. Please use the **OpenAI Compatible** channel type. Note that the proxy address entered here will only replace the domain part during the actual request. If you want to enter the Base URL required in the OpenAI SDK, please use the OpenAI Compatible channel type.',
    description:
      'Deprecated, please use OpenAI compatible channel type instead.',
  },
  { key: 22, text: 'Knowledge Base: FastGPT', value: 22, color: 'blue' },
  { key: 21, text: 'Knowledge Base: AI Proxy', value: 21, color: 'purple' },
  { key: 20, text: 'OpenRouter', value: 20, color: 'black' },
  { key: 2, text: 'Proxy: API2D', value: 2, color: 'blue' },
  { key: 5, text: 'Proxy: OpenAI-SB', value: 5, color: 'brown' },
  { key: 7, text: 'Agent: OhMyGPT', value: 7, color: 'purple' },
  { key: 10, text: 'Proxy: AI Proxy', value: 10, color: 'purple' },
  { key: 4, text: 'Agent: CloseAI', value: 4, color: 'teal' },
  { key: 6, text: 'Agent: OpenAI Max', value: 6, color: 'violet' },
  { key: 9, text: 'Agent: AI.LS', value: 9, color: 'yellow' },
  { key: 12, text: 'Proxy: API2GPT', value: 12, color: 'blue' },
  { key: 13, text: 'Agent: AIGC2D', value: 13, color: 'purple' },
];
