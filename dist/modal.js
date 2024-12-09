/**
 * The Modal library.
 *
 * @github  https://github.com/wester-ir/modal
 * @version 1.0
 */
var modal = {
    classes: {
        confirmPrimaryButton: 'btn btn-primary btn-sm',
        confirmSuccessButton: 'btn btn-success btn-sm',
        confirmDangerButton: 'btn btn-danger btn-sm',
    },
    localization: {
        lang: document.querySelector('html').getAttribute('lang') || 'en',
        translations: {
            en: {},
            fa: {
                Close: 'بستن',
                Yes: 'تایید',
                'Are you sure?': 'آیا مطمئن هستید؟',
            },
        },
        get(message) {
            return this.translations[this.lang][message] || message;
        },
    },
    data: {},

    defaults: {
        confirm: function (onClick, body, className) {
            modal.create({
                body: body,
                buttons: [{
                    label: modal.localization.get('Yes'),
                    className: className,
                    onClick: function (container) {
                        onClick();
                        modal.dismiss(container.id);
                    },
                }],
            });

            return false;
        },

        confirmPrimary: function (onClick, body) {
            body = body || modal.localization.get('Are you sure?');
            modal.defaults.confirm(onClick, body, modal.classes.confirmPrimaryButton);

            return false;
        },

        confirmSuccess: function (onClick, body) {
            body = body || modal.localization.get('Are you sure?');
            modal.defaults.confirm(onClick, body, modal.classes.confirmSuccessButton);

            return false;
        },

        confirmDanger: function (onClick, body) {
            body = body || modal.localization.get('Are you sure?');
            modal.defaults.confirm(onClick, body, modal.classes.confirmDangerButton);

            return false;
        },
    },

    createButton: function (container, data) {
        const button = document.createElement('button');

        if (data.id) {
            button.id = data.id;
        }

        if (data.disabled) {
            button.disabled = true;
        }

        button.type = data.type;
        button.className = data.className;
        button.style.minWidth = '60px';
        button.innerHTML = data.label;
        button.addEventListener('click', function (e) {
            data.onClick(container, e);
        });

        return button;
    },

    dismiss: function (id) {
        var elem = document.body.querySelector('.modal[id="'+ id + '"]');

        if (elem) {
            elem.remove();

            if (document.body.querySelectorAll('.modal').length === 0) {
                document.body.style.overflow = '';
            }
        }
    },

    dismissAll: function () {
        document.body.querySelectorAll('.modal').forEach(function (elem) {
            elem.remove();
        });

        document.body.style.overflow = '';
        this.flushData();
    },

    flushData: function () {
        modal.data = {};
    },
};

/**
 * Create a modal.
 *
 * @param  object  options
 */
modal.create = function (options) {
    options = options || {};
    options.title = options.title || null;
    options.body = options.body || null;
    options.size = options.size || 'small';
    options.closeOutside = options.closeOutside !== undefined ? options.closeOutside : true;
    options.closeButton = options.closeButton !== undefined ? options.closeButton : true;
    options.buttons = options.buttons || [];

    // Elements
    var elements = {};
    elements.modal = document.createElement('div');
    elements.modal.id = (Math.random() + 1).toString(36).substring(2);
    elements.container = document.createElement('div');
    elements.header = document.createElement('div');
    elements.headerTitle = document.createElement('div');
    elements.headerClose = document.createElement('button');
    elements.body = document.createElement('div');
    elements.footer = document.createElement('div');

    // Classes
    elements.modal.className = 'modal';
    elements.container.className = 'modal-container modal-' + options.size;
    elements.header.className = 'modal-header';
    elements.headerTitle.className = 'modal-title';
    elements.headerClose.className = 'modal-close';
    elements.body.className = 'modal-body';
    elements.footer.className = 'modal-footer';

    // HTML
    elements.headerClose.innerHTML = '<svg class="svg-icon" style="width: 10px; height: 10px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M895.156706 86.256941a30.177882 30.177882 0 0 1 42.767059-0.180706c11.745882 11.745882 11.745882 30.870588-0.180706 42.767059L128.843294 937.743059c-11.866353 11.866353-30.930824 12.047059-42.767059 0.180706-11.745882-11.745882-11.745882-30.870588 0.180706-42.767059L895.156706 86.256941z" fill="#000000" /><path d="M86.076235 86.076235c11.745882-11.745882 30.870588-11.745882 42.767059 0.180706l808.899765 808.899765c11.866353 11.866353 12.047059 30.930824 0.180706 42.767059-11.745882 11.745882-30.870588 11.745882-42.767059-0.180706L86.256941 128.843294a30.177882 30.177882 0 0 1-0.180706-42.767059z" fill="#000000" /><path d="M0 0h1024v1024H0z" fill="#FFF4F4" fill-opacity="0" /></svg>';

    // Events
    if (options.scrollReachedBottom) {
        elements.body.addEventListener('scroll', () => {
            if (elements.body.scrollTop + elements.body.clientHeight >= elements.body.scrollHeight) {
                options.scrollReachedBottom();
            }
        });
    }

    // Container
    elements.modal.appendChild(elements.container);
    if (options.closeOutside) {
        elements.modal.onclick = function (event) {
            if (event.target === elements.modal) {
                modal.dismiss(elements.modal.id);
            }
        };
    }

    // Header
    if (options.title) {
        elements.headerTitle.innerHTML = options.title;

        elements.container.appendChild(elements.header);
        elements.header.appendChild(elements.headerTitle);
        elements.header.appendChild(elements.headerClose);

        // Close Button
        elements.headerClose.onclick = function () {
            modal.dismiss(elements.modal.id);
        };
    }

    // Body
    elements.container.appendChild(elements.body);
    if (typeof options.body === 'string') {
        elements.body.innerHTML = options.body;
    } else {
        elements.body.append(options.body);
    }

    // Close Button
    if (options.closeButton) {
        options.buttons.push({
            id: 'modal-close-btn',
            label: modal.localization.get('Close'),
            className: 'btn btn-secondary btn-sm',
            onClick: function () {
                modal.dismiss(elements.modal.id);
            },
        });
    }

    // Footer & Buttons
    if (options.buttons.length > 0) {
        elements.container.appendChild(elements.footer);

        options.buttons.forEach(function (data) {
            elements.footer.appendChild(modal.createButton(elements.modal, data));
        });
    }

    // Append the current modal
    document.body.appendChild(elements.modal);
    document.body.style.overflow = 'hidden';
};
