import prisma from "../../prisma/client.js";
import { throwError } from "../../utils/response.util.js";

const canteenService = {

  create: async (payload) => { 
    const {campus_id, ...canteenData} = payload;
    const isCampus = await prisma.campus.findUnique({where:{id:campus_id}})
    if(!isCampus){
      throwError("Campus không tồn tại để tạo canteen!",404)
    }
    return await prisma.canteen.create({
      data: {
        ...canteenData,
        campus_id,
      },
    });
  },
  
  getAll: async () => {
    return await prisma.canteen.findMany({
      include: {
        campus: {
          select: {
            name: true
          }
        }, 
      },
    });
  }
}
export default canteenService