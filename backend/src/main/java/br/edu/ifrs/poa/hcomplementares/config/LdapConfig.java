package br.edu.ifrs.poa.hcomplementares.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;
import org.springframework.security.ldap.authentication.BindAuthenticator;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.search.FilterBasedLdapUserSearch;
import org.springframework.security.ldap.search.LdapUserSearch;
import org.springframework.security.ldap.userdetails.LdapAuthoritiesPopulator;

@Configuration
public class LdapConfig {

    @Bean
    public DefaultSpringSecurityContextSource ldapContextSource(
            LdapProperties properties
    ) {
        var contextSource = new DefaultSpringSecurityContextSource(
                List.of(properties.url()),
                properties.baseDn()
        );

        contextSource.setUserDn(
                properties.managerDn()
        );

        contextSource.setPassword(
                properties.managerPassword()
        );

        return contextSource;
    }

    @Bean
    public LdapUserSearch ldapUserSearch(
            DefaultSpringSecurityContextSource contextSource,
            LdapProperties properties
    ) {
        var userSearch = new FilterBasedLdapUserSearch(
                properties.userSearchBase(),
                properties.userSearchFilter(),
                contextSource
        );

        userSearch.setSearchSubtree(
                properties.searchSubtree()
        );

        return userSearch;
    }

    @Bean
    public BindAuthenticator bindAuthenticator(
            DefaultSpringSecurityContextSource contextSource,
            LdapUserSearch userSearch
    ) {
        var authenticator = new BindAuthenticator(
                contextSource
        );

        authenticator.setUserSearch(userSearch);

        return authenticator;
    }

    @Bean
    public AuthenticationProvider ldapAuthenticationProvider(
            BindAuthenticator bindAuthenticator,
            LdapAuthoritiesPopulator authoritiesPopulator
    ) {
        return new LdapAuthenticationProvider(
                bindAuthenticator,
                authoritiesPopulator
        );
    }
}