import { SignJWT, jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(
process.env.JWT_SECRET
);

export async function createToken(payload: {
userId: string;
companyId: string;
email: string;
role?: string;
}) {
return await new SignJWT(payload)
.setProtectedHeader({
alg: "HS256",
})
.setIssuedAt()
.setExpirationTime("7d")
.sign(secretKey);
}

export async function verifyToken(token: string) {
const { payload } = await jwtVerify(
token,
secretKey
);

return payload;
}
