# Medical Image Viewer

Simplificarea interactiunii dintre medic si pacient, astfel pacientul poate primii radiografia direct de la medic, fara sa mai fie nevoie de tiparirea acesteia sau primirea unui CD cu aceasta.
De asemenea pacientul va putea conversa cu medicul printr-o functionalitate de chat, separat pentru fiecare studiu.

## Prereq

// TODO: mai scrie aci cum faci

Trebuie create env-uri pentru orthanc, backend si orthProxy. Si un certificat, poate fi self-signed sau nu.

## Start infra:
Din radacina proiectului:

```sh
make run-infra
```

## Start mobile:

```sh
make run-mobile
```

## Build mobile:

```sh
make build-mobile
```