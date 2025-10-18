#!/bin/bash

# Script de déploiement pour Nostr Social Network
# Usage: ./scripts/deploy.sh [environment]

set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Vérifier les prérequis
check_prerequisites() {
    log "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js n'est pas installé"
    fi
    
    # Vérifier pnpm
    if ! command -v pnpm &> /dev/null; then
        error "pnpm n'est pas installé"
    fi
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        error "Git n'est pas installé"
    fi
    
    log "Prérequis validés ✓"
}

# Installer les dépendances
install_dependencies() {
    log "Installation des dépendances..."
    pnpm install --frozen-lockfile
    log "Dépendances installées ✓"
}

# Lancer les tests
run_tests() {
    log "Exécution des tests..."
    pnpm test --passWithNoTests
    log "Tests passés ✓"
}

# Lancer le linter
run_linter() {
    log "Exécution du linter..."
    pnpm lint
    log "Linter validé ✓"
}

# Build de production
build_production() {
    log "Build de production..."
    pnpm build
    log "Build terminé ✓"
}

# Vérifier la taille du bundle
check_bundle_size() {
    log "Vérification de la taille du bundle..."
    
    # Créer un rapport de taille
    pnpm build 2>&1 | grep -E "(Route|First Load JS|chunks)" || true
    
    log "Vérification du bundle terminée ✓"
}

# Déploiement
deploy() {
    local environment=${1:-production}
    
    log "Déploiement en environnement: $environment"
    
    case $environment in
        "staging")
            log "Déploiement sur staging..."
            # Ajouter ici la logique de déploiement staging
            ;;
        "production")
            log "Déploiement sur production..."
            # Ajouter ici la logique de déploiement production
            ;;
        *)
            error "Environnement non supporté: $environment"
            ;;
    esac
    
    log "Déploiement terminé ✓"
}

# Nettoyage
cleanup() {
    log "Nettoyage..."
    rm -rf .next
    log "Nettoyage terminé ✓"
}

# Fonction principale
main() {
    local environment=${1:-production}
    
    log "Début du processus de déploiement"
    
    check_prerequisites
    install_dependencies
    run_tests
    run_linter
    build_production
    check_bundle_size
    deploy $environment
    cleanup
    
    log "Déploiement terminé avec succès! 🎉"
}

# Gestion des erreurs
trap 'error "Le déploiement a échoué"' ERR

# Exécution
main "$@"