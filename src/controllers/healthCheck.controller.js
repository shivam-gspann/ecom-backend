export const healthCheck = async (req, res) => {
  try {
    return res.status(200).json("Health checked successfully");
  } catch (error) {
    console.error(
      error?.message || "Something went wrong while checking health"
    );
    return res.status(500).json({
      error: error?.message || "Something went wrong while checking health",
    });
  }
};
