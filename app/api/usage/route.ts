import { NextResponse } from 'next/server';

interface Message {
  id: number;
  timestamp: string;
  text: string;
  report_id?: string;
}

interface Report {
  name: string;
  credit_cost: number;
}

interface UsageItem {
  message_id: number;
  timestamp: string;
  report_name?: string;
  credits_used: number;
}

const BASE_MODEL_RATE = 40;
const MIN_CREDITS = 1.00;
const CHARS_PER_TOKEN = 4;

/**
 * Calculate credits used for a message without a report_id
 * Based on token estimation: 1 token ≈ 4 characters
 * Formula: credits_used = (estimated_count/100) * base_model_rate
 * Minimum cost of 1.00 always applies
 */
function calculateCreditsFromText(text: string): number {
  const estimatedTokens = text.length / CHARS_PER_TOKEN;
  const credits = (estimatedTokens / 100) * BASE_MODEL_RATE;
  return Math.max(MIN_CREDITS, Math.round(credits * 100) / 100);
}

/**
 * Fetch report details by ID
 */
async function fetchReport(reportId: string): Promise<Report | null> {
  try {
    const response = await fetch(
      `https://owpublic.blob.core.windows.net/tech-task/reports/${reportId}`
    );
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching report ${reportId}:`, error);
    return null;
  }
}

/**
 * Process a single message and calculate credits
 */
async function processMessage(message: Message): Promise<UsageItem> {
  let usageItem: UsageItem;

  if (message.report_id) {
    // Fetch report details to get name and credit cost
    const report = await fetchReport(message.report_id);
    if (report) {
      usageItem = {
        message_id: message.id,
        timestamp: message.timestamp,
        report_name: report.name,
        credits_used: report.credit_cost,
      };
    } else {
      // If report fetch fails, fall back to text-based calculation
      usageItem = {
        message_id: message.id,
        timestamp: message.timestamp,
        report_name: undefined,
        credits_used: calculateCreditsFromText(message.text),
      };
    }
  } else {
    // Calculate credits based on message text
    usageItem = {
      message_id: message.id,
      timestamp: message.timestamp,
      report_name: undefined,
      credits_used: calculateCreditsFromText(message.text),
    };
  }

  return usageItem;
}

export async function GET() {
  try {
    // Fetch messages from the current period endpoint
    const response = await fetch(
      'https://owpublic.blob.core.windows.net/tech-task/messages/current-period'
    );

    if (!response.ok) {
      console.error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: 'Failed to fetch messages', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Handle different possible response formats
    let messages: Message[] = [];
    if (Array.isArray(data)) {
      messages = data;
    } else if (data && Array.isArray(data.messages)) {
      messages = data.messages;
    } else if (data && Array.isArray(data.data)) {
      messages = data.data;
    } else {
      console.error('Messages response is not in expected format:', data);
      return NextResponse.json(
        { error: 'Invalid response format from messages API', received: typeof data },
        { status: 500 }
      );
    }

    // Process all messages in parallel
    const usageItems = await Promise.all(
      messages.map(message => processMessage(message))
    );

    return NextResponse.json({ usage: usageItems });
  } catch (error) {
    console.error('Error processing usage data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

