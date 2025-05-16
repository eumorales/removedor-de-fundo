import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image_file") as File

    if (!imageFile) {
      return NextResponse.json({ error: "Nenhuma imagem foi enviada" }, { status: 400 })
    }

    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const removeApiKey = process.env.REMOVE_BG_API

    if (!removeApiKey) {
      return NextResponse.json({ error: "API key não configurada" }, { status: 500 })
    }

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": removeApiKey,
        Accept: "application/json",
      },
      body: createFormData(buffer, imageFile.name),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.errors?.[0]?.title || "Erro ao processar a imagem" },
        { status: response.status },
      )
    }

    const data = await response.json()

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${data.data.result_b64}`,
    })
  } catch (error) {
    console.error("Error processing image:", error)
    return NextResponse.json({ error: "Erro ao processar a imagem" }, { status: 500 })
  }
}

function createFormData(buffer: Buffer, filename: string) {
  const formData = new FormData()

  const blob = new Blob([buffer])
  formData.append("image_file", blob, filename)

  formData.append("size", "auto")
  formData.append("format", "auto")

  return formData
}
