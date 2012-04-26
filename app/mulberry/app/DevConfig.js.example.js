/**
 * THIS FILE IS FOR DEV USE ONLY
 * It should be maintained locally and never checked into the repo.
 */

toura.features = toura.features || {};
mulberry.features = mulberry.features || {};

toura.features.debugPage = true; // Type 'mulberry:<anything> in search will provide debugging info
toura.features.siblingNav = true; // Allows navigation between sibling nodes
toura.features.sharing = true; // Enables sharing features
toura.features.favorites = true; // Allows users to favorite nodes
toura.features.fontSize = true; // Allows users to change font size
toura.features.ads = false; // Allows users to enable ads

mulberry.features.debugToolbar = true; // The makes resetting the DB and using weinre easier
mulberry.feedProxyUrl = 'http://api.toura.com'; // Point at an alternative feed proxy server
