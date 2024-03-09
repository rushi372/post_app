import postModel from "../models/postModel.js";

//getPostsController
export const getPostsController = async (req, res) => {
  try {
    const data = await postModel.find({});

    return res.status(200).send({
      success: true,
      message: "Got all the posts",
      data,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "Error in getPostsController",
      error,
    });
  }
};
