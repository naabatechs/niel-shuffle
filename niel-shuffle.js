class NielShuffle {
    constructor(selector, options = {}) {
        // Default options
        this.options = {
            elementId: selector,
            imageDir: options.imageDir || null,
            interval: options.interval || 5000,
            animation: options.animation || 'fade',
            entryAnimation: options.entryAnimation,
            exitAnimation: options.exitAnimation,
            shuffleType: options.shuffleType || 'random',
            preload: options.preload || false,
            lazyLoad: options.lazyLoad || false,
            defaultImage: options.defaultImage || this.getDefaultImage(),
            showLoader: options.showLoader || false,
            loadOnPageLoad: options.loadOnPageLoad !== undefined ? options.loadOnPageLoad : true,
        };

        // Handle multiple elements
        this.elements = this.getElements(selector);
        if (this.elements.length === 0) {
            console.error('No valid elements found for selector: ' + selector);
            return;
        }

        // Loop through all matched elements
        this.elements.forEach(element => {
            this.imgElement = element;
            this.init();
        });
    }

    // Helper function to get elements by ID or class
    getElements(selector) {
        // Check if selector starts with '#' (ID) or '.' (class)
        if (selector.startsWith('#')) {
            const element = document.getElementById(selector.substring(1));
            return element ? [element] : [];
        } else if (selector.startsWith('.')) {
            return Array.from(document.querySelectorAll(selector));
        } else {
            return [];
        }
    }

    init() {
        if (!this.imgElement) return;

        if (this.options.showLoader) {
            this.createLoader();
        }

        if (this.options.imageDir) {
            this.fetchImages(this.options.imageDir)
                .then(images => {
                    this.hideLoader();
                    if (images.length === 0) {
                        this.handleError('No images found in directory');
                        return;
                    }
                    this.images = this.shuffleImages(images, this.options.shuffleType);
                    if (this.options.loadOnPageLoad) {
                        this.updateImage();
                    }
                    if (this.options.interval > 0) {
                        setInterval(() => this.updateImage(), this.options.interval);
                    }
                })
                .catch(err => {
                    this.handleError(err.message);
                });
        } else {
            this.handleError('No directory specified');
        }
    }

    async fetchImages(imageDir) {
        try {
            const response = await fetch(imageDir);
            const files = await response.json();
            return files.filter(file => /\.(jpg|jpeg|png|gif|svg|webp)$/.test(file));
        } catch (error) {
            throw new Error('Unable to fetch images or invalid directory');
        }
    }

    shuffleImages(images, shuffleType) {
        if (shuffleType === 'ascending') {
            return images.sort();
        } else if (shuffleType === 'descending') {
            return images.sort().reverse();
        } else {
            for (let i = images.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [images[i], images[j]] = [images[j], images[i]];
            }
            return images;
        }
    }

    updateImage() {
        this.showLoader();

        // Remove any existing animation classes
        this.imgElement.classList.remove(
            // Animate.css classes
            'animate__animated',
            'animate__bounce',
            'animate__flash',
            'animate__pulse',
            'animate__rubberBand',
            'animate__shakeX',
            'animate__shakeY',
            'animate__headShake',
            'animate__swing',
            'animate__tada',
            'animate__wobble',
            'animate__jello',
            'animate__heartBeat',
            'animate__backInDown',
            'animate__backInLeft',
            'animate__backInRight',
            'animate__backInUp',
            'animate__backOutDown',
            'animate__backOutLeft',
            'animate__backOutRight',
            'animate__backOutUp',
            'animate__bounceIn',
            'animate__bounceInDown',
            'animate__bounceInLeft',
            'animate__bounceInRight',
            'animate__bounceInUp',
            'animate__bounceOut',
            'animate__bounceOutDown',
            'animate__bounceOutLeft',
            'animate__bounceOutRight',
            'animate__bounceOutUp',
            'animate__fadeIn',
            'animate__fadeInDown',
            'animate__fadeInDownBig',
            'animate__fadeInLeft',
            'animate__fadeInLeftBig',
            'animate__fadeInRight',
            'animate__fadeInRightBig',
            'animate__fadeInUp',
            'animate__fadeInUpBig',
            'animate__fadeInTopLeft',
            'animate__fadeInTopRight',
            'animate__fadeInBottomLeft',
            'animate__fadeInBottomRight',
            'animate__fadeOut',
            'animate__fadeOutDown',
            'animate__fadeOutDownBig',
            'animate__fadeOutLeft',
            'animate__fadeOutLeftBig',
            'animate__fadeOutRight',
            'animate__fadeOutRightBig',
            'animate__fadeOutUp',
            'animate__fadeOutUpBig',
            'animate__fadeOutTopLeft',
            'animate__fadeOutTopRight',
            'animate__fadeOutBottomRight',
            'animate__fadeOutBottomLeft',
            'animate__flip',
            'animate__flipInX',
            'animate__flipInY',
            'animate__flipOutX',
            'animate__flipOutY',
            'animate__lightSpeedInRight',
            'animate__lightSpeedInLeft',
            'animate__lightSpeedOutRight',
            'animate__lightSpeedOutLeft',
            'animate__rotateIn',
            'animate__rotateInDownLeft',
            'animate__rotateInDownRight',
            'animate__rotateInUpLeft',
            'animate__rotateInUpRight',
            'animate__rotateOut',
            'animate__rotateOutDownLeft',
            'animate__rotateOutDownRight',
            'animate__rotateOutUpLeft',
            'animate__rotateOutUpRight',
            'animate__hinge',
            'animate__jackInTheBox',
            'animate__rollIn',
            'animate__rollOut',
            'animate__zoomIn',
            'animate__zoomInDown',
            'animate__zoomInLeft',
            'animate__zoomInRight',
            'animate__zoomInUp',
            'animate__zoomOut',
            'animate__zoomOutDown',
            'animate__zoomOutLeft',
            'animate__zoomOutRight',
            'animate__zoomOutUp',
            'animate__slideInDown',
            'animate__slideInLeft',
            'animate__slideInRight',
            'animate__slideInUp',
            'animate__slideOutDown',
            'animate__slideOutLeft',
            'animate__slideOutRight',
            'animate__slideOutUp',
            // Your predefined classes
            'no-anim',
            'fade-out',
            'slide-left-out',
            'zoom-out',
            'slide-right-out',
            'rotate-out',
            'flip-out',
            'slide-left-in',
            'zoom-in',
            'slide-right-in',
            'rotate-in',
            'flip-in'
        );

        // Determine animations
        let entryAnimation = this.options.entryAnimation || 'animate__fadeIn';
        let exitAnimation = this.options.exitAnimation || 'animate__fadeOut';
        let predefinedAnimation = this.options.animation || 'none';

        // Apply predefined animation (if any) before applying entry and exit animations
        if (predefinedAnimation !== 'none') {
            this.imgElement.classList.add(predefinedAnimation);
        }

        // Apply exit animation
        this.imgElement.classList.add('animate__animated', exitAnimation);

        setTimeout(() => {
            const nextImage = this.images.shift();
            this.images.push(nextImage);
            this.imgElement.src = nextImage;

            // Remove predefined animation class (if any)
            if (predefinedAnimation !== 'none') {
                this.imgElement.classList.remove(predefinedAnimation);
            }

            // Remove exit animation and apply entry animation
            this.imgElement.classList.remove('animate__animated', exitAnimation);
            this.imgElement.classList.add('animate__animated', entryAnimation);

            // Remove the entry animation class after it ends
            this.imgElement.addEventListener('animationend', () => {
                this.imgElement.classList.remove('animate__animated', entryAnimation);
            });

            this.hideLoader();
        }, 500);
    }

    handleError(message) {
        if (this.imgElement) {
            this.imgElement.src = this.getDefaultImage();
        }
        this.hideLoader();
        console.error(message);
    }

    getDefaultImage() {
        return 'data:image/svg+xml;base64,' + btoa(`
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 339 340">
                <defs>
                    <style>
                    .cls-1 {
                        fill: #08344c;
                        fill-rule: evenodd;
                    }
                    .cls-1, .cls-2 {
                        stroke-width: 0px;
                    }
                    .cls-3 {
                        fill: none;
                        stroke: #979797;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-width: 5px;
                    }
                    .cls-4 {
                        opacity: .4;
                    }
                    .cls-2 {
                        fill: #b7d5ff;
                    }
                    </style>
                </defs>
                <g id="Page-1">
                    <g id="Group-4">
                    <path id="Polygon" class="cls-1" d="M192.6,13.3l100.6,58.1c14.3,8.3,23.1,23.5,23.1,40v116.2c0,16.5-8.8,31.8-23.1,40l-100.6,58.1c-14.3,8.3-31.9,8.3-46.2,0l-100.6-58.1c-14.3-8.3-23.1-23.5-23.1-40v-116.2c0-16.5,8.8-31.8,23.1-40L146.4,13.3c14.3-8.3,31.9-8.3,46.2,0Z"/>
                    <g id="Group-3" class="cls-4">
                        <line id="Line" class="cls-3" x1="47.1" y1="96.8" x2="136.8" y2="142.9"/>
                        <line id="Line-2" class="cls-3" x1="201" y1="145.4" x2="286.4" y2="101.9"/>
                        <line id="Line-3" class="cls-3" x1="169" y1="189" x2="169" y2="312"/>
                    </g>
                    <ellipse id="Oval" class="cls-2" cx="169.5" cy="85" rx="28" ry="23.5"/>
                    <g id="Group-2">
                        <ellipse id="Oval-2" data-name="Oval" class="cls-2" cx="287" cy="145" rx="12.5" ry="13.5"/>
                        <ellipse id="Oval-3" data-name="Oval" class="cls-2" cx="287" cy="184" rx="12.5" ry="13.5"/>
                        <ellipse id="Oval-4" data-name="Oval" class="cls-2" cx="287" cy="227" rx="12.5" ry="13.5"/>
                        <ellipse id="Oval-5" data-name="Oval" class="cls-2" cx="221" cy="170" rx="12.5" ry="13.5"/>
                        <ellipse id="Oval-6" data-name="Oval" class="cls-2" cx="221" cy="212" rx="12.5" ry="13.5"/>
                        <ellipse id="Oval-7" data-name="Oval" class="cls-2" cx="221" cy="255" rx="12.5" ry="13.5"/>
                    </g>
                    <g id="Group">
                        <ellipse id="Oval-8" data-name="Oval" class="cls-2" cx="49" cy="145" rx="12.5" ry="13.5"/>
                        <ellipse id="Oval-9" data-name="Oval" class="cls-2" cx="81.3" cy="187.1" rx="9.8" ry="10.6"/>
                        <ellipse id="Oval-10" data-name="Oval" class="cls-2" cx="101.7" cy="228.9" rx="9.8" ry="10.6"/>
                        <ellipse id="Oval-11" data-name="Oval" class="cls-2" cx="49" cy="184" rx="12.5" ry="13.5"/>
                        <ellipse id="Oval-12" data-name="Oval" class="cls-2" cx="49" cy="227" rx="12.5" ry="13.5"/>
                        <ellipse id="Oval-13" data-name="Oval" class="cls-2" cx="137" cy="187" rx="12.5" ry="13.5"/>
                        <ellipse id="Oval-14" data-name="Oval" class="cls-2" cx="137" cy="229" rx="12.5" ry="13.5"/>
                        <ellipse id="Oval-15" data-name="Oval" class="cls-2" cx="137" cy="272" rx="12.5" ry="13.5"/>
                    </g>
                    </g>
                </g>
            </svg>
        `);
    }

    createLoader() {
        this.loader = document.createElement('div');
        this.loader.classList.add('shuffleLoader');

        this.nloader = document.createElement('div');
        this.nloader.classList.add('nloader');

        if (this.imgElement && this.imgElement.parentNode) {
            this.imgElement.parentNode.insertBefore(this.loader, this.imgElement);
            this.loader.appendChild(this.imgElement);
        }
        this.loader.appendChild(this.nloader);
    }

    showLoader() {
        if (this.nloader) {
            this.nloader.style.display = 'block';
        }
    }

    hideLoader() {
        if (this.nloader) {
            this.nloader.style.display = 'none';
        }
    }

    removeLoader() {
        if (this.loader) {
            this.loader.remove();
        }
    }
}
