class Campaign {
    constructor(id, userId, name, processDate, processHour,
                totalRecords, totalSent, totalError, processStatus, finalHour) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.processDate = processDate;
        this.processHour = processHour;
        this.totalRecords = totalRecords;
        this.totalSent = totalSent;
        this.totalError = totalError;
        this.processStatus = processStatus;
        this.finalHour = finalHour;
    }
}

module.exports = Campaign;