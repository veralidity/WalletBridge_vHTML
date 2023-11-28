if (typeof CardanoConnectWithWalletCore === 'undefined') {
    console.error('CardanoConnectWithWalletCore is not available.');
    const walletContainer = document.getElementById('switcher-wallet-nav');
    if (walletContainer) {
        walletContainer.style.display = 'none';
    }
    throw new Error(
        'CardanoConnectWithWalletCore is not defined. Make sure you have included the script tag in your html file: <script src="https://cardano-foundation.github.io/cardano-connect-with-wallet/bundle-latest/index.js></script>"'
    );
}

class CardanoWalletConnector {
    constructor() {
        this.CardanoConnectWithWalletCore = CardanoConnectWithWalletCore;
        this.config = {
            label: 'Connect Wallet',
            showEnabledWalletIcon: true,
            showUnavailableWallets: false,
            supportedWallets: [
                'eternl',
                'exodus',
                'flint',
                'gerowallet',
                'lace',
                'nami',
                'nufi',
                'typhon',
                'yoroi'
            ],
            alwaysVisibleWallets: [],
            message: undefined,
        };
        this.state = {
            isEnabled: false,
            isConnected: false,
            isConnecting: false,
            stakeAddress: null,
            enabledWallet: null,
            usedAddresses: null,
            unusedAddresses: null,
            installedExtensions: [],
            accountBalance: null,
            lastConnectedWallet: null,
            meerkatAddress: null
        };
    }

    init() {

        this.wallet = CardanoConnectWithWalletCore.Wallet;
        this.parent = document.getElementsByClassName('cardano-connect-container');

        // Call other methods to set up your functionalities
        this.addEventListeners();
        this.setupDropdownToggle();
        this.updateDropdownMenu();
    }

    addEventListeners() {
        this.wallet.addEventListener('enabledWallet', this.handleEnabledWallet.bind(this));
        this.wallet.addEventListener('installedWalletExtensions', this.handleInstalledWalletExtensions.bind(this));
        this.wallet.addEventListener('stakeAddress', this.handleStakeAddress.bind(this));
        this.wallet.addEventListener('connected', this.handleConnected.bind(this));
        this.wallet.startInjectWalletListener();
    }

    setupDropdownToggle() {
        const targetElement = document.getElementById('switcher-wallet-trigger-nav');
        if (targetElement) {
            targetElement.addEventListener('click', this.toggleDropdown.bind(this));
        }
    }

    toggleDropdown() {
        const targetElement = document.getElementById('switcher-wallet-trigger-nav');
        const walletSwitcherOptions = document.querySelectorAll('.wallet-switcher-options');
        const walletDropdowns = document.querySelectorAll('.wallet-dropdown');

        targetElement.classList.toggle('active');
        walletSwitcherOptions.forEach(elem => elem.classList.toggle('active'));

        const ariaExpanded = targetElement.getAttribute('aria-expanded') === 'true';
        targetElement.setAttribute('aria-expanded', (!ariaExpanded).toString());

        walletDropdowns.forEach(dropdown => {
            const ariaHidden = dropdown.getAttribute('aria-hidden') === 'true';
            dropdown.setAttribute('aria-hidden', (!ariaHidden).toString());
        });
    }

    updateDropdownMenu() {
        console.log("Updating dropdown menu");
        //const isMobile = CardanoConnectWithWalletCore.checkIsMobile();
        const availableWallets = CardanoConnectWithWalletCore.estimateAvailableWallets(
            this.config.supportedWallets,
            this.config.showUnavailableWallets,
            this.config.alwaysVisibleWallets,
            this.state.installedExtensions
        );

        for (let i = 0; i < this.parent.length; i++) {
            this.parent[i].innerHTML = '';

            if (availableWallets.length === 0) {
                const label = `Please install a wallet browser extension (${CardanoConnectWithWalletCore.formatSupportedWallets(
                    this.config.supportedWallets
                )} are supported)`;

                this.parent[i].appendChild(
                    this.createMenuItem(label, null, 'connect-wallet-hint')
                );
            } else if (this.state.stakeAddress !== null) {
                if (typeof this.config.message === 'string') {
                    this.parent[i].appendChild(
                        this.createMenuItem(
                            'Sign Message',
                            () => { this.wallet.signMessage(this.config.message); }
                        )
                    );
                }

                if (this.config.showEnabledWalletIcon && this.state.isConnected && this.state.enabledWallet) {
                    this.parent[i].appendChild(
                        this.createMenuItem(
                            'Disconnect ' + this.state.enabledWallet,
                            () => { this.wallet.disconnect(); },
                            null,
                            this.getWalletClass(this.state.enabledWallet)
                        )
                    );

                } else if (!this.config.showEnabledWalletIcon && this.state.isConnected && this.state.enabledWallet) {
                    this.parent[i].appendChild(
                        this.createMenuItem(
                            'Disconnect ' + this.state.enabledWallet,
                            () => { this.wallet.disconnect(); },
                            null,
                            this.getWalletClass(this.state.enabledWallet)
                        )
                    );
                }

            } else {
                for (const extension of availableWallets) {
                    this.parent[i].appendChild(
                        this.createMenuItem(
                            extension,
                            () => { this.wallet.connectToWallet(extension); },
                            null,
                            this.getWalletClass(extension)
                        )
                    );
                }
            }
        }
    }

    handleEnabledWallet(enabledWallet) {
        console.log("handleEnabledWallet called", enabledWallet);
        this.state.enabledWallet = enabledWallet;
        this.updateDropdownMenu();
    }

    handleInstalledWalletExtensions(installedExtensions) {
        console.log("handleInstalledWalletExtensions called", installedExtensions);
        this.state.installedExtensions = installedExtensions;
        this.updateDropdownMenu();
    }

    handleStakeAddress(stakeAddress) {
        console.log("handleStakeAddress called", stakeAddress);
        this.state.stakeAddress = stakeAddress;
        this.updateDropdownMenu();
    }

    handleConnected(isConnected) {
        console.log("handleConnected called", isConnected);
        this.state.isConnected = isConnected;
        if (isConnected) {
            this.updateDropdownMenu();
        }
    }

    createMenuItem(label, onClick, id, walletClass) {
        let walletListItem = document.createElement('li');
        walletListItem.className = 'switcher-option connect-wallet-menu-item';

        // Append additional class if provided
        if (walletClass) {
            walletListItem.className += ' ' + walletClass;
        }

        // Set the ID if provided
        if (typeof id === 'string') {
            walletListItem.id = id;
        }

        // Attach the click event handler if provided
        if (typeof onClick === 'function') {
            walletListItem.onclick = onClick;
        }

        // Append the text label
        walletListItem.appendChild(document.createTextNode(label));

        return walletListItem;
    }

    getWalletClass(wallet) {
        // This method returns a CSS class based on the wallet name
        // The class is used for styling the wallet icon or representation in the UI
        return ' ' + wallet + '-logo';
    }

    getStakeAddressTitle() {
        // This method formats the stake address for display
        if (this.state.stakeAddress) {
            // Returns a shortened version of the stake address
            return `${this.state.stakeAddress.slice(0, 12)}...`;
        }
        return 'No Stake Address';
    }

    addCss(element, style) {
        for (const property in style) {
            if (style.hasOwnProperty(property)) {
                element.style[property] = style[property];
            }
        }
    }
}

// Instantiate and initialize the class
const walletConnector = new CardanoWalletConnector();
walletConnector.init();
