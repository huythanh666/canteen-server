import prisma from "../../prisma/client.js";

const campusService = {
    create: async (payload) => {
        const {name} = payload;
        return await prisma.campus.create({
            data: {
                name
            }
        });
    },
    getAllCampus: async () => {
        return await prisma.campus.findMany();
    }
}

export default campusService