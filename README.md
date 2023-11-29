# Veralidity WalletBridge - HTML Version

This repository contains the HTML and JavaScript implementation of Veralidity's WalletBridge, a lightweight and flexible solution for integrating Cardano wallet functionality into web applications.

## Features

- Easy integration with any HTML/JavaScript-based project.
- Dynamic wallet connection interface.
- Supports multiple Cardano wallets.
- Customizable CSS for easy styling.
- Compatible with desktop and mobile browsers*
    - Although the UI works on mobile, we need to handle the mobile wallet integration itself, so if integrating this into your project you will want to build upon this or hide the wallet icon via CSS for mobile only so you don't confuse people as to why they can't connect to a wallet.

## Installation

To use WalletBridge in your project, include the following files in your HTML:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.5.5/css/simple-line-icons.min.css" integrity="sha512-QKC1UZ/ZHNgFzVKSAhV5v5j73eeL9EEN289eKAEFaAjgAiobVAnVv/AGuPbXsKl1dNoel3kNr6PYnSiTzVVBCw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet" type="text/css" href="path/to/your/styles.css"/>
<script type="text/javascript" src="https://cardano-foundation.github.io/cardano-connect-with-wallet/bundle-latest/index.js"></script>
<script type="text/javascript" src="path/to/your/cardano-connect.js"></script>
```

Replace path/to/your/ with the actual paths where your CSS and JavaScript files are located.

## Usage
- Include the WalletBridge CSS and JavaScript files in your HTML.
- Add the following HTML structure where you want the wallet dropdown to appear:

```html
<div class="switcher wallet switcher-wallet" id="switcher-wallet-nav">
    <strong class="label switcher-label">
        <span class="my-wallet-label">My Wallet</span>
    </strong>
    <div class="actions dropdown options switcher-options wallet-switcher-options">
        <div class="action toggle switcher-trigger" id="switcher-wallet-trigger-nav" role="button" tabindex="0">
            <strong>
                <span>Connect Wallet</span>
            </strong>
        </div>
        <ul class="dropdown switcher-dropdown wallet-dropdown cardano-connect-container" id="cardano-connect-container" aria-hidden="true">
            <!-- Wallet items will be populated here dynamically -->
        </ul>
    </div>
</div>
```

### PoC
This is a Proof of Concept, and is not finalized, nor does it incorporate everything that the original authors had implemented. Please build upon this and make it better. If you encounter issues I'm more than happy to help to an extent, but this is provided as-is, and without gaurantees or warantees. Use at your own risk. With that, have fun, cheers.

## Magento 2 Extension

For Adobe Commerce Magento 2 users, we also offer a Magento 2 extension version of WalletBridge. You can find it at [Veralidity WalletBridge for Magento 2](https://github.com/veralidity/WalletBridge).






