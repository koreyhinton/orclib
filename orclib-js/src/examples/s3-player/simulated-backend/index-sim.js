
module.exports = (req, res) => {
    const s3media = { url: "" };
    res.render('index', { s3media });
};
