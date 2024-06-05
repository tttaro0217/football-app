import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = params;
  console.log(id);

  // リクエストがGETメソッドである場合のみ処理を実行
  try {
    const accessToken = "104b117cf5a24bd29b209edb06877ad8";
    const personsMatchesUrl = `http://api.football-data.org/v4/persons/${id}/matches`; // APIのエンドポイントURL
    const headers = {
      // リクエストヘッダー
      "Content-Type": "application/json",
      "X-Auth-Token": accessToken,
    };
    const res = await fetch(personsMatchesUrl, { headers }); // APIエンドポイントにGETリクエストを送信してデータを取得
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }
    const data = await res.json(); // レスポンスをJSON形式で解析

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
