import { GET } from '../route';

// Mock global fetch
global.fetch = jest.fn();

describe('/api/usage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return usage data with credits calculated from text when no report_id', async () => {
    const mockMessages = [
      {
        id: 1,
        timestamp: '2024-01-01T10:00:00Z',
        text: 'Hello world', // 11 characters, ~2.75 tokens, ~1.10 credits (min 1.00)
      },
      {
        id: 2,
        timestamp: '2024-01-01T11:00:00Z',
        text: 'This is a longer message with more characters to test credit calculation', // 72 characters, ~18 tokens, ~7.2 credits
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMessages,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('usage');
    expect(data.usage).toHaveLength(2);
    expect(data.usage[0]).toEqual({
      message_id: 1,
      timestamp: '2024-01-01T10:00:00Z',
      credits_used: 1.1, // (11/4)/100 * 40 = 2.75/100 * 40 = 1.1
    });
    expect(data.usage[1]).toEqual({
      message_id: 2,
      timestamp: '2024-01-01T11:00:00Z',
      credits_used: 7.2, // (72/4)/100 * 40 = 18/100 * 40 = 7.2
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://owpublic.blob.core.windows.net/tech-task/messages/current-period'
    );
  });

  it('should return usage data with report name and credit cost when report_id exists', async () => {
    const mockMessages = [
      {
        id: 1,
        timestamp: '2024-01-01T10:00:00Z',
        text: 'Generate report',
        report_id: 'report-123',
      },
    ];

    const mockReport = {
      name: 'Monthly Analytics Report',
      credit_cost: 15.5,
    };

    // Mock messages fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMessages,
    });

    // Mock report fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReport,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.usage).toHaveLength(1);
    expect(data.usage[0]).toEqual({
      message_id: 1,
      timestamp: '2024-01-01T10:00:00Z',
      report_name: 'Monthly Analytics Report',
      credits_used: 15.5,
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      'https://owpublic.blob.core.windows.net/tech-task/messages/current-period'
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'https://owpublic.blob.core.windows.net/tech-task/reports/report-123'
    );
  });

  it('should handle mixed messages with and without report_id', async () => {
    const mockMessages = [
      {
        id: 1,
        timestamp: '2024-01-01T10:00:00Z',
        text: 'Short message',
        report_id: 'report-123',
      },
      {
        id: 2,
        timestamp: '2024-01-01T11:00:00Z',
        text: 'This message has no report',
      },
    ];

    const mockReport = {
      name: 'Test Report',
      credit_cost: 10.0,
    };

    // Mock messages fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMessages,
    });

    // Mock report fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockReport,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.usage).toHaveLength(2);
    expect(data.usage[0]).toEqual({
      message_id: 1,
      timestamp: '2024-01-01T10:00:00Z',
      report_name: 'Test Report',
      credits_used: 10.0,
    });
    expect(data.usage[1]).toEqual({
      message_id: 2,
      timestamp: '2024-01-01T11:00:00Z',
      credits_used: 2.6, // (26/4)/100 * 40 = 6.5/100 * 40 = 2.6
    });
  });

  it('should fall back to text-based calculation when report fetch fails', async () => {
    const mockMessages = [
      {
        id: 1,
        timestamp: '2024-01-01T10:00:00Z',
        text: 'Test message with 50 characters exactly for credit testing',
        report_id: 'invalid-report-id',
      },
    ];

    // Mock messages fetch
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMessages,
    });

    // Mock report fetch failure
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.usage).toHaveLength(1);
    expect(data.usage[0]).toEqual({
      message_id: 1,
      timestamp: '2024-01-01T10:00:00Z',
      credits_used: 5.8, // (58/4)/100 * 40 = 14.5/100 * 40 = 5.8
    });
    expect(data.usage[0]).not.toHaveProperty('report_name');
  });

  it('should apply minimum credit cost of 1.00 for short messages', async () => {
    const mockMessages = [
      {
        id: 1,
        timestamp: '2024-01-01T10:00:00Z',
        text: 'Hi', // 2 characters, ~0.5 tokens, ~0.2 credits, but min is 1.00
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMessages,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.usage[0].credits_used).toBe(1.0);
  });

  it('should round credits to 2 decimal places', async () => {
    const mockMessages = [
      {
        id: 1,
        timestamp: '2024-01-01T10:00:00Z',
        text: 'This is exactly 37 characters long for test', // 43 chars, ~10.75 tokens, ~4.3 credits
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMessages,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.usage[0].credits_used).toBe(4.3);
    // Verify it's a number with max 2 decimal places
    expect(data.usage[0].credits_used.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
  });

  it('should return error when messages endpoint fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error', 'Failed to fetch messages');
  });

  it('should return 500 error when fetch throws an exception', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error', 'Internal server error');
    
    consoleSpy.mockRestore();
  });

  it('should handle empty messages array', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.usage).toEqual([]);
  });
});

