export class FetchError extends Error {
  status: number;
  data: unknown;
  url: string;

  constructor(message: string, status: number, data: unknown, url: string) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.data = data;
    this.url = url;
  }
}

export async function fetchClient<T = unknown>(
  url: string,
  options: RequestInit = {}
) {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  let data: T | null = null;
  const contentType = res.headers.get("Content-Type");

  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    data = text as unknown as T;
  }

  if (!res.ok) {
    throw new FetchError(
      `Fetch error: ${res.status} ${res.statusText}`,
      res.status,
      data,
      url
    );
  }

  return data;
}
