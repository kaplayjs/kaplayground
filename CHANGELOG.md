# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.6] - 2025-07-30

### Fixed

- Fix importing projects exported after v2.3 - @imaginarny

## [2.3.5] - 2025-06-22

### Fixed

- Fix cases where assets weren't loading using `assets/`
- Fix importing project

## [2.3.4] - 2025-06-21

### Fixed

- Now theme should always be "Spiker"

## [2.3.3] - 2025-05-16

### Fixed

- Fixed the /crew asset parsing not working properly - @lajbel
- Fixed ?example= from url when saving a project - @lajbel

## [2.3.2] - 2025-05-16

### Added

- Now when opening demos, the url is updated to the demo url

### Fixed

- Fixed visual bugs in the editor - @imaginarny
- Fixed demo links not using ?example=[exampleName] - @lajbel

## [2.3.1] - 2025-05-14

### Fixed

- Fixed bugs in the editor view - @imaginarny
- Fixed a bug where some configurations wasn't being updated - @lajbel

## [2.3.0] - 2025-05-12

### Added

- Now file state (cursor position, selected, scroll, undo/redo) is saved and preserved
  when switching between files
- Better UI in Project Dropdown in Toolbar

### Changed

- `Project.id` is depracted inside `.kaplay` files, you can safely remove it

### Fixed

- Fixed bugs in the editor
- Rendering Optimization
- Bean added to Project Core

## [2.2.2] - 2025-05-5

### Fixed

- Fixed bugs in the editor

## [2.2.1] - 2025-05-5

### Fixed

- Fixed bugs in the editor

## [2.2.0] - 2025-04-26

### Added

- Group projects and examples by category, topic or difficulty
- Sort projects and examples by group options, type or latest
- Filter projects and examples by tags
- New and Updated labels added to examples

## [2.1.1] - 2025-04-15

### Added

- New KAPLAYGROUND logo
- Console log pane added
- Asset brew pane added to Example workspace
- Project now auto-saves when renamed
- User-friendly empty state screen for My Projects in Projects Browser added
- Editor word wrap toggling as a command and config option

### Changed

- Overal design updated to match the website redesign and rebrand
- Editor now has a custom color theme
- Resized pane sizes are now remembered after a page reload
- Current project is highlighted and synced across Projects Browser and select
- Project reruns on version change

### Fixed

- Project naming and filtering by project type in the Projects select

## [2.1.0] - 2025-03-25

### Added

- Now share links have version
- Now you can select `master` version for using latest commit

### Changed

- First part of redesign making style be more similar to website

## [2.0.2] - 2025-01-15

### Changed

- Now version selector doesn't lie about the version! - @lajbel

## 2.0.1 (3/11/2024)

- Renamed examples to demos

## 2.0.0 (31/10/2024) Spooky Edition

- todo()

## 1.0.0-beta (27/5/2024)

Project renamed to **KAPLAYGROUND**, due to the name **KAPLAY** is now used
by [KAPLAY](https://kaplayjs.com), a game engine.

### Features

- ⭐ Multi-file editing support (with scenes)
- ⭐ KAPLAY examples support
- ⭐ Tooltip, toasts and much feedback!
- ⭐ Now Kaboom configuration is supported in the editor (no in share links/examples)
- added fonts support
- added a loading screen
- added reset project option
- now editor is snapable at all

### Misc

- new logo, hi dino!
- now kaplay is used instead kaboom

## 0.1.1 (9/5/2024)

- fixed code url not loading

## 0.1.0 (9/5/2024)

The initial release!

### Features

- added project import and export
- added panes resizing
- now assets dragging in editor put the asset in a new line

### Bug Fixes

- fixed duplied assets
- fixed (doubtful) a bug of editor writing

### Misc

- added about the project window
