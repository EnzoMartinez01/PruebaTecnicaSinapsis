class Message {
    constructor(id, campaignId, phone, text, shippingStatus, shippingHour) {
        this.id = id;
        this.campaignId = campaignId;
        this.phone = phone;
        this.text = text;
        this.shippingStatus = shippingStatus;
        this.shippingHour = shippingHour;
    }
}

module.exports = Message;