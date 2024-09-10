const Resource = function (code, translations) {
    this.code = code;
    this.translations = translations || [];
}

Resource.prototype.addTranslation = function (translation) {
    if (!translation) {
        return;
    }
    this.translations.push(translation);
}

Resource.prototype.getTranslation = function (language) {
    return this.translations.find(t => t.language === language);
}

Resource.prototype.deleteTranslation = function (language) {
    const index = this.translations.findIndex(t => t.language === language);
    if (index !== -1) {
        this.translations.splice(index, 1);
    }
}

module.exports = Resource;
