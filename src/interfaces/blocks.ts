interface Block {
    id: number,
    votes_obtained: number,
    valid_vote_issued: number,
    municipality: {
        id: string,
        name: string,
        shield: string
    },
    entity: {
        id: number,
        name: string
        acronym: string,
        logo: string
    },
    registrations: {
        stats: {
            total: number,
            women: number,
            mans: number
        }
    }
}

export default Block;