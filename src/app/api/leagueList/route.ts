//src/app/api/leaguList/route.ts

export async function GET() {
  // リクエストがGETメソッドである場合のみ処理を実行
  try {
    const accessToken = "104b117cf5a24bd29b209edb06877ad8";
    const leagueListUrl = "http://api.football-data.org/v4/competitions/"; // APIのエンドポイントURL
    const headers = {
      // リクエストヘッダー
      "Content-Type": "application/json",
      "X-Auth-Token": accessToken,
    };

    const res = await fetch(leagueListUrl, { headers }); // APIエンドポイントにGETリクエストを送信してデータを取得
    const jsonData = await res.text(); // レスポンスをテキストとして取得
    const data = JSON.parse(jsonData); // レスポンスをJSON形式で解析);

    return Response.json({ data });
  } catch (error) {
    console.error("Error fetching data:", error); // エラーをキャッチしてログに記録し、エラーレスポンスを返す
    return Response.json({ error: "Failed to fetch data" });
  }
}
