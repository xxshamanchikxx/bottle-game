export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Отправляем на сервер
    const response = await fetch("http://localhost:4000/api/host-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ success: false, message: "Ошибка сервера" }, { status: 500 });
  }
}
