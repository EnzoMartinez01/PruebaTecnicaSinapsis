const express = require('express');
const router = express.Router();
const campaignService = require('../services/campaignService');
const {authenticateCustomer} = require("../middlewares/auth");

router.put('/:campaignId/calculate-totals', authenticateCustomer, async (req, res) => {
    console.log(`Recibida solicitud para actualizar totales de campaña ID: ${req.params.campaignId}`);
    try {
        const updatedTotals = await campaignService.calculateAndUpdateCampaignTotals(req.params.campaignId);
        res.status(200).json({
            message: 'Totales de la campaña actualizados',
            ...updatedTotals
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:campaignId/update-status', authenticateCustomer, async (req, res) => {
    try {
        const result = await campaignService.updateCampaignStatus(req.params.campaignId);
        res.status(200).json({
            message: 'Estado de campaña actualizado',
            ...result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/sucessful-messages', authenticateCustomer, async (req, res) => {
   const { startDate, endDate } = req.query;

   if (!startDate || !endDate) {
       return res.status(400).json({ message: 'Debes Proporcionar startDate y endDate'});
   }

   try {
       const customers = await campaignService.getCustomersWithSuccessfulMessages(startDate, endDate);
       res.status(200).json(customers);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
});

router.get('/participation/:customerId', authenticateCustomer, async (req, res) => {
    try {
        const users = await campaignService.getUserParticipationByCustomer(req.params.customerId);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;