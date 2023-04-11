import type { ServerLoad } from "$types"

export const load: ServerLoad = ({ locals }) => {

    const user = locals.user
    return {
        user
    }
}