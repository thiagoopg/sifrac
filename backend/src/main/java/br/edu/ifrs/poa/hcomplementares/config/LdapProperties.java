package br.edu.ifrs.poa.hcomplementares.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ldap")
public record LdapProperties(
        String url,
        String baseDn,
        String managerDn,
        String managerPassword,
        String userSearchBase,
        String userSearchFilter,
        String groupSearchBase,
        String groupSearchFilter,
        boolean searchSubtree
) {
}