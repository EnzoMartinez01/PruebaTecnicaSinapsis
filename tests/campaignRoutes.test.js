const request = require('supertest');
const express = require('express');
const router = require('../routes/campaignRoutes');
const campaignService = require('../services/campaignService');

jest.mock('../services/campaignService', () => ({
    calculateAndUpdateCampaignTotals: jest.fn(),
    updateCampaignStatus: jest.fn(),
    getCustomersWithSuccessfulMessages: jest.fn(),
    getUserParticipationByCustomer: jest.fn()
}));

jest.mock('../middlewares/auth', () => ({
    authenticateCustomer: (req, res, next) => next()
}));


const app = express();
app.use(express.json());
app.use('/campaigns', router);

describe('Pruebas para Campañas', () => {
    test('PUT /campaigns/:campaignId/calculate-totals - Actualiza totales de campaña', async () => {
        campaignService.calculateAndUpdateCampaignTotals.mockResolvedValue({ totalRecords: 10, totalSent: 5 });

        const res = await request(app)
            .put('/campaigns/1/calculate-totals')
            .set('Authorization', 'Bearer fake-token');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            message: 'Totales de la campaña actualizados',
            totalRecords: 10,
            totalSent: 5
        });
    });

    test('PUT /campaigns/:campaignId/update-status - Actualiza estado de la campaña', async () => {
        campaignService.updateCampaignStatus.mockResolvedValue({ status: 'Completed' });

        const res = await request(app)
            .put('/campaigns/1/update-status')
            .set('Authorization', 'Bearer fake-token');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            message: 'Estado de campaña actualizado',
            status: 'Completed'
        });
    });

    test('GET /campaigns/sucessful-messages - Obtiene mensajes exitosos', async () => {
        campaignService.getCustomersWithSuccessfulMessages.mockResolvedValue([{ customerId: 1, messageSent: 50 }]);

        const res = await request(app)
            .get('/campaigns/sucessful-messages?startDate=2024-01-01&endDate=2025-01-31')
            .set('Authorization', 'Bearer fake-token');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ customerId: 1, messageSent: 50 }]);
    });

    test('GET /campaigns/sucessful-messages - Falla por falta de fechas', async () => {
        const res = await request(app)
            .get('/campaigns/sucessful-messages')
            .set('Authorization', 'Bearer fake-token');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'Debes Proporcionar startDate y endDate' });
    });

    test('GET /campaigns/participation/:customerId - Obtiene participación del usuario', async () => {
        campaignService.getUserParticipationByCustomer.mockResolvedValue([{ userId: 7, campaignsParticipated: 3 }]);

        const res = await request(app)
            .get('/campaigns/participation/7')
            .set('Authorization', 'Bearer fake-token');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ userId: 7, campaignsParticipated: 3 }]);
    });
});