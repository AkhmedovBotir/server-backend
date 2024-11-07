const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('Foydalanuvchi topilmadi');
    
    res.status(200).json({
      username: user.username,
      email: user.email,
      // Boshqa profil ma'lumotlari
    });
  } catch (err) {
    res.status(500).send('Xatolik yuz berdi');
  }
};

module.exports = getUserProfile;
