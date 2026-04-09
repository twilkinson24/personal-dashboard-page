export async function onRequest(context) {
  const NOTION_API_KEY = context.env.NOTION_API_KEY;
  const DATABASE_ID = context.env.NOTION_DATABASE_ID;

  const jsonHeaders = { "Content-Type": "application/json" };

  if (!NOTION_API_KEY || !DATABASE_ID) {
    return new Response(
      JSON.stringify({ error: "NOTION_API_KEY or NOTION_DATABASE_ID not configured" }),
      { status: 500, headers: jsonHeaders }
    );
  }

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: {
            property: "Done",
            checkbox: {
              equals: false,
            },
          },
          page_size: 3,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.message || "Notion API error", code: response.status }),
        { status: 502, headers: jsonHeaders }
      );
    }

    if (!data.results) {
      return new Response(
        JSON.stringify({ error: "Unexpected response", debug: data }),
        { status: 502, headers: jsonHeaders }
      );
    }

    const propKeys = data.results.length > 0
      ? Object.keys(data.results[0].properties)
      : [];

    const tasks = data.results.map((page) => ({
      id: page.id,
      task: page.properties.Task?.title?.[0]?.plain_text || "Untitled",
      client: page.properties.Client?.select?.name || null,
    }));

    return new Response(
      JSON.stringify({ tasks, _debug_props: propKeys }),
      { headers: jsonHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: jsonHeaders }
    );
  }
}
