---
title: Fix can't create customer with different addresses
issue: NEXT-39853
---
# Administration
* Removed the computed `isSameBilling` property from the `sw-order-new-customer-modal` component and replaced it with a watcher with similar logic.
* Added watcher `isSameBilling` in the `sw-order-new-customer-modal` component to listen for changes in the billing address and update the shipping address accordingly.
