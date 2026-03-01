import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { COMPASS_SYSTEM_PROMPT } from '@/docs/compassPrompt';
import {
  computeCallOptionFacts,
  computeStockBuyFacts,
  validateCallOptionInput,
  validateStockBuyInput,
  type CallOptionInput,
  type StockBuyInput,
} from '@/lib/compute';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.type || !['call_option', 'stock_buy'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid or missing type. Must be "call_option" or "stock_buy".' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (body.type === 'call_option') {
      const validationError = validateCallOptionInput(body);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    } else {
      const validationError = validateStockBuyInput(body);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    }

    // Compute facts deterministically
    const facts =
      body.type === 'call_option'
        ? computeCallOptionFacts(body as CallOptionInput)
        : computeStockBuyFacts(body as StockBuyInput);

    // Send facts + input to LLM for narration only
    const userMessage = JSON.stringify({ input: body, facts });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: COMPASS_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json(
        { error: 'No response from AI model.' },
        { status: 500 }
      );
    }

    // Strip markdown code fences if present
    let rawText = textBlock.text.trim();
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    const parsed = JSON.parse(rawText);

    return NextResponse.json(parsed);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Failed to parse AI response as JSON.' },
        { status: 500 }
      );
    }

    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
