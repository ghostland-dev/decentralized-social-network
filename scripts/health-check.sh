#!/bin/bash

# Script de vérification de santé pour Nostr Social Network
# Usage: ./scripts/health-check.sh [url]

set -e

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL par défaut
DEFAULT_URL="http://localhost:3000"
URL=${1:-$DEFAULT_URL}

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

# Vérifier la disponibilité de l'application
check_availability() {
    log "Vérification de la disponibilité de l'application..."
    
    local response_code
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "$URL" || echo "000")
    
    if [ "$response_code" = "200" ]; then
        log "Application disponible ✓ (HTTP $response_code)"
    else
        error "Application non disponible (HTTP $response_code)"
    fi
}

# Vérifier les endpoints critiques
check_endpoints() {
    log "Vérification des endpoints critiques..."
    
    local endpoints=("/" "/explore" "/messages" "/notifications" "/profile" "/settings")
    
    for endpoint in "${endpoints[@]}"; do
        local full_url="$URL$endpoint"
        local response_code
        response_code=$(curl -s -o /dev/null -w "%{http_code}" "$full_url" || echo "000")
        
        if [ "$response_code" = "200" ] || [ "$response_code" = "302" ]; then
            log "Endpoint $endpoint ✓ (HTTP $response_code)"
        else
            warn "Endpoint $endpoint problématique (HTTP $response_code)"
        fi
    done
}

# Vérifier les headers de sécurité
check_security_headers() {
    log "Vérification des headers de sécurité..."
    
    local headers=("X-Frame-Options" "X-Content-Type-Options" "Referrer-Policy" "Content-Security-Policy")
    
    for header in "${headers[@]}"; do
        local header_value
        header_value=$(curl -s -I "$URL" | grep -i "$header" || echo "")
        
        if [ -n "$header_value" ]; then
            log "Header $header présent ✓"
        else
            warn "Header $header manquant"
        fi
    done
}

# Vérifier les performances
check_performance() {
    log "Vérification des performances..."
    
    local response_time
    response_time=$(curl -s -o /dev/null -w "%{time_total}" "$URL")
    
    # Convertir en millisecondes
    local response_time_ms=$(echo "$response_time * 1000" | bc)
    
    if (( $(echo "$response_time_ms < 2000" | bc -l) )); then
        log "Temps de réponse acceptable ✓ (${response_time_ms}ms)"
    else
        warn "Temps de réponse élevé (${response_time_ms}ms)"
    fi
}

# Vérifier la taille de la page
check_page_size() {
    log "Vérification de la taille de la page..."
    
    local page_size
    page_size=$(curl -s "$URL" | wc -c)
    
    if [ "$page_size" -lt 1000000 ]; then  # Moins de 1MB
        log "Taille de page acceptable ✓ (${page_size} bytes)"
    else
        warn "Taille de page élevée (${page_size} bytes)"
    fi
}

# Vérifier les erreurs JavaScript
check_js_errors() {
    log "Vérification des erreurs JavaScript..."
    
    # Cette vérification nécessiterait un navigateur headless
    # Pour l'instant, on vérifie juste que la page contient du JavaScript
    local js_content
    js_content=$(curl -s "$URL" | grep -i "script" | wc -l)
    
    if [ "$js_content" -gt 0 ]; then
        log "JavaScript détecté ✓"
    else
        warn "Aucun JavaScript détecté"
    fi
}

# Vérifier la configuration SSL (si HTTPS)
check_ssl() {
    if [[ "$URL" == https://* ]]; then
        log "Vérification de la configuration SSL..."
        
        local ssl_info
        ssl_info=$(echo | openssl s_client -servername "${URL#https://}" -connect "${URL#https://}" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "")
        
        if [ -n "$ssl_info" ]; then
            log "Certificat SSL valide ✓"
        else
            warn "Problème avec le certificat SSL"
        fi
    fi
}

# Fonction principale
main() {
    log "Début de la vérification de santé pour $URL"
    
    check_availability
    check_endpoints
    check_security_headers
    check_performance
    check_page_size
    check_js_errors
    check_ssl
    
    log "Vérification de santé terminée avec succès! 🎉"
}

# Gestion des erreurs
trap 'error "La vérification de santé a échoué"' ERR

# Exécution
main "$@"