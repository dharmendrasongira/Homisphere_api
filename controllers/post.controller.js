import prisma from "../lib/prisma.js";


export const getPosts = async (req, res) => {
    const query = req.query;

    try {
        const posts = await prisma.post.findMany({
            where: {
                // Remove the 'query' field here
                city: query.city || undefined,
                type: query.type || undefined,
                property: query.property || undefined,
                bedroom: parseInt(query.bedroom) || undefined,
                price: {
                    gte: parseInt(query.minPrice) || 0,
                    lte: parseInt(query.maxPrice) || 10000000,
                }
            }
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error getting posts"});
    }
}

export const getPost = async (req, res) => {
  const id = req.params.id;
  console.log("id",id);
  
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });

          res.status(200).json({ ...post, isSaved: saved ? true : false });
        }
      });
    }

    res.status(200).json({ ...post, isSaved: false });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};



export const createPost = async(req,res)=>{
    const body = req.body;
    const tokenUserId = req.userId;

    try {
         const post = await prisma.post.create({
            data: {
                ...body.postData,
                userId: tokenUserId,
                postDetail:{
                    create: body.postDetail,
                },
            }
         })

        res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Failed to create post"});
    }
}


export const updatePost = async(req,res)=>{
    const {title,content} = req.body;
    try {
        const updatedPost = await prisma.post.update({where:{id:parseInt(req.params.id)},data:{title,content}});
        if(!updatedPost){
            return res.status(404).json({message:"Post not found"})
        }
        res.status(200).json(updatedPost)
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Error updating post"})
    }
}

export const deletePost = async(req,res)=>{
    const id = req.params.id;
    const token = req.userId;
    try {
        const post = await prisma.post.findUnique({
            where:{id}
        })
        if(post.userId !== token){
            return res.status(403).json({message:"Forbidden: Only the user who made the request can delete"})
        }
        await prisma.post.delete({where:{id}});
        res.status(200).json({message:"dleted post"})
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message:"Error deleting post"})

    }
}

