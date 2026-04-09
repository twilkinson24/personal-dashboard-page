export async function onRequest(context) {
  const NOTION_API_KEY = context.env.NOTION_API_KEY;
  const DATABASE_ID = context.env.NOTION_DATABASE_ID;

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

    const tasks = data.results.map((page) => ({
      id: page.id,
      task: page.properties.Task.title[0]?.plain_text || "Untitled",
      client: page.properties.Client.select?.name || null,
    }));

    return Response.json(tasks, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return Response.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}
