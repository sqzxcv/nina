class News {
    constructor() {
        self.url = null
        self.title = null
        self.content = null
        self.time = null
        self.contentElement = null
    }

    getUrl() {
        return self.url;
    }

    setUrl(url) {
        self.url = url;
    }

    getTitle() {
        return self.title;
    }

    setTitle(title) {
        self.title = title;
    }

    getContent() {
        if (self.content == null) {
            if (self.contentElement != null) {
                self.content = contentElement.text();
            }
        }
        return self.content;
    }

    setContent(content) {
        self.content = content;
    }

    getTime() {
        return self.time;
    }

    setTime(time) {
        self.time = time;
    }

    toString() {
        return "URL:\n" + url + "\nTITLE:\n" + title + "\nTIME:\n" + time + "\nCONTENT:\n" + getContent() + "\nCONTENT(SOURCE):\n" + self.contentElement;
    }

    getContentElement() {
        return self.contentElement;
    }

    setContentElement(contentElement) {
        self.contentElement = contentElement;
    }
}