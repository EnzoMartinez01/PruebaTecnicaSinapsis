class User {
    constructor(id, customerId, username, deleted) {
        this.id = id;
        this.customerId = customerId;
        this.username = username;
        this.deleted = deleted;
    }
}

module.exports = User;