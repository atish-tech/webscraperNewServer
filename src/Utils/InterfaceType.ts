export interface WebPageData {
  url: string;
  resourceType: string;
  responseText: string;
  initiator: string;
  headers: string;
  method: string;
  postData: string;
  statusCode: number;
  error: string;
}

export interface HtmlElementToJsonType {
  type: string;
  tagName: string;
  attributes: Array<{ key: string; value: string }>;
  text?: string;
  content?: string;
  children: HtmlElementToJsonType[];
}
