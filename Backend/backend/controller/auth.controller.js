const { signupService, loginService } = require("../services/auth.service");

const signupController = async (req, res) => {
  try {
    const user = await signupService(req.body);
    res.status(201).json({
      success: true,
      message: "Utente registrato con successo",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginService(email, password);
    res.status(200).json({
      success: true,
      message: "Accesso riuscito",
      token,
      user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { signupController, loginController };
