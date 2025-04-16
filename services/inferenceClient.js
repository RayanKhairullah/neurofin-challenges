const { InferenceClient } = require('@huggingface/inference');

const HF_API_KEY = process.env.HF_API_KEY;

if (!HF_API_KEY) {
  console.error('Error: HF_API_KEY is not set in environment variables.');
  process.exit(1);
}

const client = new InferenceClient(HF_API_KEY);

module.exports = client;
