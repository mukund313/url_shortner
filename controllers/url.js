const shortid = require('shortid');
const URL = require('../models/url');

async function handleGenerateNewShortUrl(req, res) {
    const body = req.body;

    if (!body.url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const shortId = shortid.generate(); 
    try {
        await URL.create({
            shortId: shortId,
            redirectURL: body.url,
            visitHistorry: [],
            createdBy: req.user._id
        });

        //code for ssr
        return res.render("home", {
            id: shortId // Corrected variable name
        });

        // code for api
        // return res.json({ id: shortId });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'shortId must be unique.' });
        }
        return res.status(500).json({ error: 'An error occurred while creating the URL.' });
    }

}


async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    console.log(shortId)
    const result = await URL.findOne({shortId});
    return res.json({totalClicks: result.visitHistorry.length, analytics: result.visitHistorry})
}


module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics
};
