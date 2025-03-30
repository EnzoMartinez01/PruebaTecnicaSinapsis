const pool = require('../db/connection');

async function calculateAndUpdateCampaignTotals(campaignId) {
    const [rows] = await pool.execute(
        `SELECT
             COUNT(*) AS totalRecords,
             SUM(CASE WHEN shipping_status = 1 THEN 1 ELSE 0 END) AS totalPending,
             SUM(CASE WHEN shipping_status = 2 THEN 1 ELSE 0 END) AS totalSent,
             SUM(CASE WHEN shipping_status = 3 THEN 1 ELSE 0 END) AS totalError
         FROM messages
         WHERE campaign_id = ?`,
        [campaignId]
    );

    if (rows.length === 0) {
        throw new Error(`No se encontraron datos para la campaña con ID ${campaignId}`);
    }

    const { totalRecords, totalPending, totalSent, totalError } = rows[0];

    await pool.execute(
        `UPDATE campaigns
         SET total_records = ?, total_sent = ?, total_error = ?
         WHERE id = ?`,
        [totalRecords, totalSent, totalError, campaignId]
    );

    return {
        campaignId,
        totalRecords: totalRecords || 0,
        totalPending: totalPending || 0,
        totalSent: totalSent || 0,
        totalError: totalError || 0
    };
}

async function updateCampaignStatus(campaignId) {
    try {
        const [rows] = await pool.execute(
            `SELECT
                 MAX(m.shipping_hour) AS finalHour,
                 SUM(CASE WHEN m.shipping_status = 1 THEN 1 ELSE 0 END) AS pendingMessages,
                 SUM(CASE WHEN m.shipping_status = 2 THEN 1 ELSE 0 END) AS sentMessages,
                 SUM(CASE WHEN m.shipping_status = 3 THEN 1 ELSE 0 END) AS errorMessages,
                 ca.process_date,
                 ca.process_hour
             FROM campaigns ca
                      LEFT JOIN messages m ON ca.id = m.campaign_id
             WHERE ca.id = ?
             GROUP BY ca.id, ca.process_date, ca.process_hour`,
            [campaignId]
        );

        if (rows.length === 0) {
            throw new Error(`No se encontró la campaña con ID ${campaignId}`);
        }

        const { finalHour, pendingMessages, sentMessages, errorMessages, process_date, process_hour } = rows[0];

        const processTimestamp = new Date(`${process_date}T${process_hour}`);
        const now = new Date();

        let processStatus = 1;
        let finalHourMessage = "La campaña no ha finalizado. Hay mensajes pendientes.";

        if (pendingMessages === 0 && processTimestamp < now) {
            processStatus = 2;
            finalHourMessage = finalHour || "No se registró una hora final.";
        }

        const finalHourValue = processStatus === 2 ? finalHour : null;

        await pool.execute(
            `UPDATE campaigns
             SET process_status = ?, final_hour = ?
             WHERE id = ?`,
            [processStatus, finalHourValue, campaignId]
        );

        return {
            campaignId,
            processStatus,
            pendingMessages,
            sentMessages,
            errorMessages,
            finalHour: finalHourMessage
        };
    } catch (error) {
        console.error(`Error updating campaign ${campaignId}:`, error);
        throw error;
    }
}

async function getCustomersWithSuccessfulMessages(startDate, endDate) {
    const [result] = await pool.execute(
        `SELECT c.id, c.name, COUNT(m.id) AS total_successful_messages
         FROM customers c
                  JOIN users u ON u.customer_id = c.id
                  JOIN campaigns ca ON ca.user_id = u.id
                  JOIN messages m ON m.campaign_id = ca.id
         WHERE m.shipping_status = 2
           AND ca.process_date BETWEEN ? AND ?
         GROUP BY c.id, c.name`, [startDate, endDate]
    );

    return result;
}

async function getUserParticipationByCustomer(customerId) {
    const [totalCampaigns] = await pool.execute(`
        SELECT COUNT(c.id) AS total
        FROM campaigns c
                 JOIN users u ON c.user_id = u.id
        WHERE u.customer_id = ?`, [customerId]);

    const total = totalCampaigns[0].total || 1;

    const [users] = await pool.execute(`
        SELECT u.id, u.username, COUNT(c.id) AS total_campaigns,
               ROUND((COUNT(c.id) / NULLIF(?, 0)) * 100, 1) AS participation_percentage
        FROM users u
                 LEFT JOIN campaigns c ON c.user_id = u.id
        WHERE u.customer_id = ?
        GROUP BY u.id, u.username`, [total, customerId]);

    return users.map(user => ({
        ...user,
        participation_percentage: `${user.participation_percentage}%`
    }));
}


module.exports = {
    calculateAndUpdateCampaignTotals,
    updateCampaignStatus,
    getCustomersWithSuccessfulMessages,
    getUserParticipationByCustomer
};
