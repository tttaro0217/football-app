import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = params;
  console.log(id);

  // リクエストがGETメソッドである場合のみ処理を実行
  try {
    const accessToken = process.env.FOOTBALL_DATA_API_ACCESS_TOKEN;
    const teamsMatchesUrl = `${process.env.FOOTBALL_DATA_API_BASE_URL}/teams/${id}/matches`; // APIのエンドポイントURL
    const headers: HeadersInit = {
      // リクエストヘッダー
      "Content-Type": "application/json",
      "X-Auth-Token": accessToken || "",
    };
    const res = await fetch(teamsMatchesUrl, { headers }); // APIエンドポイントにGETリクエストを送信してデータを取得
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

export const revalidate = 0;
