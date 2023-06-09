import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, cookies }) => {
    const data = await request.json()

    if (!data.username) {
        throw error(404, 'username is require')
    }

    if (!data.password) {
        throw error(404, 'password is require')
    }

    cookies.set('token', 'token_value', {
        path: '/'
    })

    return json({ name: data.username, id: 1 })

}