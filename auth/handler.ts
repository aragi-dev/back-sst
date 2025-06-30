import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export async function handler(_event) {
  if (!JWT_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "JWT_SECRET no configurado en el entorno" }),
    };
  }
  const apiToken = jwt.sign(
    {
      purpose: "api-protection",
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ apiToken }),
  };
}
