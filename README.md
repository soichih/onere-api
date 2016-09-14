[![Build Status](https://travis-ci.org/soichih/onere-api.svg?branch=master)](https://travis-ci.org/soichih/onere-api)
[![Coverage Status](https://coveralls.io/repos/github/soichih/onere-api/badge.svg?branch=master)](https://coveralls.io/github/soichih/onere-api?branch=master)

# ONORE-API

ONERE REST API server

# Mission Scope

The open neuroscience embedded reproducibility environment (ONERE). 

We propose to implement open science embedded hardware­software environments based on public cloud infrastructure to advance the scientific reproducibility of neuroscience research and extend usage to a broader base of neuroscience researchers and students. 

We plan to use software abstraction, virtualization and containerization technology (virtual machines and Docker images) to develop mechanisms to publish complete neuroscience software environments associated with published articles. We have three major goals in this work, to make reproducible software environments: 

1) available to researchers to use to replicate and extend analyses via the NSF­funded public cloud system Jetstream (Stewart et al. 2015; ACI­1445604);

2) persistently available, via DOIs, and stored persistently in IU’s online digital archive; and 

3) available through a web portal with interactive submission, archiving, search and retrieval capabilities. 

These goals will advance scientific reproducibility by enabling sharing and availability of working software environments with associated research code and data. 

Jetstream is a public cloud system based on OpenStack cloud software, part of the NSF­funded XSEDE.org cyberinfrastructure, and freely available (Stewart 2015). 

Virtual Machines execute on Jetstream also deploy on Amazon Web Services, meaning that our developments will be usable on major computing platforms expected to be available for many years to come (4+ for Jetstream, more for OpenStack and AWS services).

Testing 
==========================

```
npm install mocha -g
mocha
```


