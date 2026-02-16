# page-components Specification Delta

## Purpose

Add store showcase section to home page using carousel-left variant.

## ADDED Requirements

### Requirement: Home Page Store Showcase Section

The home page SHALL include a store showcase section using the carousel-left StoreList variant, positioned below the "See Our Food" section and above the "Hot News" section.

#### Scenario: Store showcase section placement

**GIVEN** the home page is rendered
**WHEN** the page loads
**THEN** a new section appears between "See Our Food" and "Hot News" sections
**AND** the section contains a StoreList component with `variant="carousel-left"`
**AND** the section has appropriate styling and spacing

#### Scenario: Store showcase section content

**GIVEN** the store showcase section is displayed
**WHEN** stores are available
**THEN** the carousel-left variant shows store images in carousels on the left
**AND** store information displays on the right
**AND** no map embeds are included
**AND** the layout is responsive (left-right on both mobile and desktop)