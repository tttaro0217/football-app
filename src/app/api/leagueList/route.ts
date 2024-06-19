import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accessToken = process.env.FOOTBALL_DATA_API_ACCESS_TOKEN;
    const leagueListUrl = `${process.env.FOOTBALL_DATA_API_BASE_URL}/competitions/`; // 環境変数からベースURLを取得
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Auth-Token": accessToken || "",
    };

    const res = await fetch(leagueListUrl, { headers }); // APIエンドポイントにGETリクエストを送信
    const jsonData = await res.text(); // レスポンスをテキストとして取得
    const data = JSON.parse(jsonData); // レスポンスをJSON形式で解析

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching data:", error); // エラーをキャッチしてログに記録し、エラーレスポンスを返す
    return NextResponse.json({ error: "Failed to fetch data" });
  }
}